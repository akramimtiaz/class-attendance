import type { ClassSession } from "@/db/schema";
import dayjs from "dayjs";

export function canMarkAttendance(
  session: Pick<ClassSession, "teacherId" | "sessionDate" | "markedAt" | "cancelled">,
  userId: string,
  currentDate: Date = new Date()
): boolean {
  // Teacher must be assigned to the session
  if (session.teacherId !== userId) {
    return false;
  }

  // Session must not be cancelled
  if (session.cancelled) {
    return false;
  }

  // Session must not already be marked
  if (session.markedAt) {
    return false;
  }

  // Session date must be today or in the past (NOT future)
  const sessionDay = dayjs(session.sessionDate);
  const currentDay = dayjs(currentDate);

  return sessionDay.isSame(currentDay, "day") || sessionDay.isBefore(currentDay, "day");
}

export function canCancelSession(
  session: Pick<ClassSession, "teacherId" | "sessionDate" | "markedAt" | "cancelled">,
  userId: string,
  currentDate: Date = new Date()
): boolean {
  // Teacher must be assigned to the session
  if (session.teacherId !== userId) {
    return false;
  }

  // Session must not be cancelled
  if (session.cancelled) {
    return false;
  }

  // Session must not already be marked
  if (session.markedAt) {
    return false;
  }

  // Current date must be on or before the session date (can't cancel past sessions)
  const sessionDay = dayjs(session.sessionDate);
  const currentDay = dayjs(currentDate);

  return currentDay.isSame(sessionDay, "day") || currentDay.isBefore(sessionDay, "day");
}

export function canCreateSessionForClass(
  assignedTeacherId: string,
  userId: string
): boolean {
  // User must be the assigned teacher on the class
  return assignedTeacherId === userId;
}

export function canViewAttendance(
  session: Pick<ClassSession, "markedAt">
): boolean {
  // Session must be marked/completed
  return !!session.markedAt;
}

export function getSessionStatus(
  session: Pick<ClassSession, "markedAt" | "cancelled">
): "scheduled" | "completed" | "cancelled" {
  if (session.cancelled) {
    return "cancelled";
  }
  if (session.markedAt) {
    return "completed";
  }
  return "scheduled";
}

