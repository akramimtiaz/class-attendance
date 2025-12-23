"use server";

import { eq, and, desc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { classes } from "@/db/schema";
import { itemsPerPage } from "@/lib/constants";

export async function getClassById(id: string) {
  return db.select().from(classes).where(eq(classes.id, id));
};

export async function getClassesByTeacher(teacherId: string) {
  return db
    .select()
    .from(classes)
    .where(
      and(
        eq(classes.assignedTeacherId, teacherId),
        eq(classes.isDeleted, false),
      )
    );
}

export type ClassWithSessions = Awaited<ReturnType<typeof getClasses>>[number];

export async function getClasses(
  page: number = 1,
  limit: number = itemsPerPage,
) {
  const offset = (page - 1) * limit;
  return db.query.classes.findMany({
    where: eq(classes.isDeleted, false),
    with: {
      assignedTeacher: {
        columns: {
          name: true,
        },
      },
      classStudents: {
        columns: {
          id: true,
        },
      },
      classSessions: {
        columns: {
          id: true,
          teacherId: true,
          sessionDate: true,
          markedAt: true,
        },
        orderBy: desc(classes.createdAt),
        limit: 3,
      },
    },
    orderBy: desc(classes.createdAt),
    limit,
    offset,
  });
}

export async function getTotalClassesCount() {
  return db.$count(classes, eq(classes.isDeleted, false));
}