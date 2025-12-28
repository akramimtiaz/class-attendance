"use server";

import { desc, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { classSessions, type ClassSession } from "@/db/schema";
import { itemsPerPage } from "@/lib/constants";

export async function getClassSessionsBy(
    key: keyof Pick<ClassSession, 'classId' | 'teacherId'>,
    keyId: string,
    page: number = 1,
    limit: number = itemsPerPage
) {
  const offset = (page - 1) * limit;
  return db.query.classSessions.findMany({
    where: eq(classSessions[key], keyId),
    orderBy: desc(classSessions.createdAt),
    limit,
    offset,
  });
}

export async function createClassSession(input: {
  classId: string;
  teacherId: string;
  sessionDate: string;
  createdBy: string;
}) {
  const [result] = await db
    .insert(classSessions)
    .values(input)
    .returning();

  if (!result) {
    throw new Error("Failed to create class session");
  }

  return result;
}

export async function updateClassSession(input: {
  id: string;
  teacherId: string;
  sessionDate: string;
}) {
  const [result] = await db
    .update(classSessions)
    .set({
      teacherId: input.teacherId,
      sessionDate: input.sessionDate,
    })
    .where(eq(classSessions.id, input.id))
    .returning();

  if (!result) {
    throw new Error("Failed to update class session");
  }

  return result;
}

export async function deleteClassSession(sessionId: string) {
  const [result] = await db
    .delete(classSessions)
    .where(eq(classSessions.id, sessionId))
    .returning();

  if (!result) {
    throw new Error("Failed to delete class session");
  }

  return result;
}

export async function cancelClassSession(input: {
  sessionId: string;
  cancelReason: string;
  markedByUserId: string;
}) {
  const [result] = await db
    .update(classSessions)
    .set({
      cancelled: true,
      cancelReason: input.cancelReason,
      markedByUserId: input.markedByUserId,
    })
    .where(eq(classSessions.id, input.sessionId))
    .returning();

  if (!result) {
    throw new Error("Failed to cancel class session");
  }

  return result;
}
