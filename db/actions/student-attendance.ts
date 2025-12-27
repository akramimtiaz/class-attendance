"use server";

import { db } from "@/db/drizzle";
import { studentAttendance, classSessions } from "@/db/schema";
import { eq } from "drizzle-orm";

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

