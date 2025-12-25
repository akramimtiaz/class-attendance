"use server";

import { desc, eq } from "drizzle-orm";
// import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { classStudents, Student, students } from "@/db/schema";
import { itemsPerPage } from "@/lib/constants";

export async function getStudentById(id: string) {
  return db.query.students.findFirst({
    where: eq(students.id, id),
    with: {
      classStudents: {
        with: {
          class: true,
        },
      },
    },
  });
}

export type StudentWithClasses = Awaited<ReturnType<typeof getStudents>>[number];

export async function getStudents(
  includeAttendance: boolean = false,
  page: number = 1,
  limit: number = itemsPerPage
) {
  const offset = (page - 1) * limit;
  return db.query.students.findMany({
    where: eq(students.isDeleted, false),
    with: {
      classStudents: {
        with: {
          class: true,
        },
      },
      ...(includeAttendance && {
        attendance: true,
      }),
    },
    orderBy: desc(students.createdAt),
    limit,
    offset,
  });
}

export async function getTotalStudentCount() {
  return db.$count(students, eq(students.isDeleted, false));
}

export async function createOrUpdateStudentWithClasses(
  input: {
    id?: string;
    name: string;
    age: number;
    guardianName: string;
    guardianContact: string;
    assignedClasses: string[];
  }
) {
  return db.transaction(async (tx) => {
    const { assignedClasses, id: studentId, ...student } = input;
    let insertedStudent: Student;

    if (studentId) {
    const [result] = await tx.update(students)
      .set(student)
      .where(eq(students.id, studentId)).returning();
      insertedStudent = result;
    } else {
      const [result] = await tx.insert(students).values(student).returning();
      insertedStudent = result;
    }

    if (!insertedStudent) {
      throw new Error("Failed to create student");
    }

    if (assignedClasses?.length > 0) {
      await tx.insert(classStudents).values(
        input.assignedClasses.map((classId) => ({
          classId,
          studentId: insertedStudent.id,
        }))
      );
    }
  });
}
