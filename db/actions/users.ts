"use server";

import { eq, and, desc } from "drizzle-orm";
// import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { itemsPerPage } from "@/lib/constants";

export async function getUserById(id: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

export async function getUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export type TeacherWithClasses = Awaited<ReturnType<typeof getTeachers>>[number];

export async function getTeachers(page: number = 1, limit: number = itemsPerPage) {
  const offset = (page - 1) * limit;
  return await db.query.users.findMany({
    where: and(
      eq(users.role, "teacher"),
      eq(users.isDeleted, false)
    ),
    with: {
      classesAssigned: {
        with: {
          classStudents: true,
        }
      }
    },
    orderBy: desc(users.createdAt),
    limit,
    offset,
  });
}

export async function getTotalTeachersCount() {
  return db.$count(
    users,
    and(eq(users.role, "teacher"), eq(users.isDeleted, false))
  );
}