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
