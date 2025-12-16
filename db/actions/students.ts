"use server";

import { desc, eq } from "drizzle-orm";
// import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { students } from "@/db/schema";

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

export async function getStudents(
  includeAttendance: boolean = false,
  page: number = 1,
  limit: number = 5
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
