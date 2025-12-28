"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, XCircle, Calendar1 } from "lucide-react";
import dayjs from "dayjs";
import type { TeacherSession } from "@/db/actions/teacher-sessions";
import {
  canMarkAttendance,
  canCancelSession,
  canViewAttendance,
  getSessionStatus,
} from "@/lib/teacher-permissions";
import { AttendanceDialog } from "./attendance-dialog";
import { CancelSessionDialog } from "./cancel-session-dialog";
import { ViewAttendanceDialog } from "./view-attendance-dialog";

type TeacherSessionRowProps = {
  session: TeacherSession;
  currentUserId: string;
};

export default function TeacherSessionRow({
  session,
  currentUserId,
}: TeacherSessionRowProps) {
  const currentDate = new Date();
  const status = getSessionStatus(session);

  const showMarkAttendance = canMarkAttendance(session, currentUserId, currentDate);
  const showCancel = canCancelSession(session, currentUserId, currentDate);
  const showViewAttendance = canViewAttendance(session);

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Calendar className="h-6 w-6 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-lg">
            {session.class.className}
          </div>
          <div className="text-base text-foreground">
            {dayjs(session.sessionDate).format("dddd, MMMM D, YYYY")}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Created By: {session.createdBy.name}, Assigned: {session.teacher.name}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {showMarkAttendance && (
          <AttendanceDialog
            className={session.class.className}
            students={session.students}
            sessionId={session.id}
            trigger={
              <Button variant="outline" size="sm">
                Mark Attendance
              </Button>
            }
          />
        )}
        {showCancel && (
          <CancelSessionDialog
            sessionId={session.id}
            sessionDate={session.sessionDate}
            trigger={
              <Button variant="outline" size="sm">
                <XCircle className="h-4 w-4" />
              </Button>
            }
          />
        )}
        {showViewAttendance && (
          <ViewAttendanceDialog
            className={session.class.className}
            sessionId={session.id}
            sessionDate={session.sessionDate}
            trigger={
              <Button variant="outline" size="sm">
                View Attendance
              </Button>
            }
          />
        )}
        {status === "scheduled" && (
          <Badge variant="outline">
            <Calendar1 className="h-4 w-4 mr-1" />
            Scheduled
          </Badge>
        )}
        {status === "completed" && (
          <Badge variant="default">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )}
        {status === "cancelled" && (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        )}
      </div>
    </div>
  );
}

