"use server";

import { db } from "@/db/drizzle";
import { studentAttendance, classSessions } from "@/db/schema";
import { eq, gte, sql, and } from "drizzle-orm";

export async function createStudentAttendanceRecords({
  sessionId,
  studentAttendance: attendanceRecords,
  markedByUserId,
}: {
  sessionId: string;
  studentAttendance: Array<{ studentId: string; attended: boolean }>;
  markedByUserId: string;
}) {
  // Insert all attendance records
  await db.insert(studentAttendance).values(
    attendanceRecords.map((record) => ({
      sessionId,
      studentId: record.studentId,
      attended: record.attended,
      markedByUserId,
    }))
  );

  // Update the class session to mark it as completed
  await db
    .update(classSessions)
    .set({
      markedByUserId,
      markedAt: new Date(),
    })
    .where(eq(classSessions.id, sessionId));
}

export async function getAverageAttendanceLast30Days() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const result = await db
    .select({
      totalAttendance: sql<number>`count(*)`,
      presentCount: sql<number>`sum(case when ${studentAttendance.attended} then 1 else 0 end)`,
    })
    .from(studentAttendance)
    .innerJoin(
      classSessions,
      eq(studentAttendance.sessionId, classSessions.id)
    )
    .where(
      and(
        gte(classSessions.sessionDate, thirtyDaysAgo.toISOString().split('T')[0]),
        eq(classSessions.cancelled, false)
      )
    );

  if (!result[0] || result[0].totalAttendance === 0) {
    return 0;
  }

  const percentage = (result[0].presentCount / result[0].totalAttendance) * 100;
  return Math.round(percentage);
}

