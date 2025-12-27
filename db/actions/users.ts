"use server";

import { eq, and, desc } from "drizzle-orm";
// import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { classes, userRoleEnum, users } from "@/db/schema";
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
        columns: {
          className: true,
        },
        where: eq(classes.isActive, true),
        with: {
          classStudents: {
            columns: {
              id: true,
            },
          },
        },
      },
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

export async function getTotalActiveTeachersCount() {
  return db.$count(
    users,
    and(eq(users.role, "teacher"), eq(users.isDeleted, false))
  );
}

export type TeacherForAssignment = Awaited<
  ReturnType<typeof getTeachersForAssignment>
>[number];

export async function getTeachersForAssignment() {
  return db.query.users.findMany({
    where: and(
      eq(users.role, "teacher"),
      eq(users.isDeleted, false)
    ),
    columns: {
      id: true,
      name: true,
    },
    orderBy: desc(users.createdAt),
  });
}

export async function createOrUpdateTeacher(input: {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
}) {
  return db.transaction(async (tx) => {
    const { id: teacherId, ...rest } = input;

    let teacher: typeof users.$inferSelect;

    if (teacherId) {
      const [result] = await tx
        .update(users)
        .set(rest)
        .where(eq(users.id, teacherId))
        .returning();

      teacher = result;
    } else {
      const [result] = await tx
        .insert(users)
        .values({
          ...rest,
          role: userRoleEnum.enumValues[1],
          // todo: update
          hashedPassword: 'password',
        })
        .returning();

      teacher = result;
    }

    if (!teacher) {
      throw new Error("Failed to create or update teacher");
    }

    return teacher;
  });
}
