"use server";

import { desc, eq } from "drizzle-orm";
// import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { classStudents, students } from "@/db/schema";
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

export type StudentByClass = Awaited<ReturnType<typeof getStudentsByClass>>[number];

export async function getStudentsByClass(classId: string) {
  return db.query.classStudents.findMany({
    where: eq(classStudents.classId, classId),
    with: {
      student: {
        columns: {
          name: true,
        }
      },
    }
  })
};
