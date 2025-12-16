"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { classes } from "@/db/schema";

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
