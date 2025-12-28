"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from "lucide-react";
import { getSessionAttendance } from "@/db/actions/student-attendance";
import day from "dayjs";

type ViewAttendanceDialogProps = {
  trigger: React.ReactNode;
  className: string;
  sessionId: string;
  sessionDate: string;
};

type AttendanceRecord = {
  id: string;
  sessionId: string;
  studentId: string;
  attended: boolean | null;
  markedByUserId: string;
  markedAt: Date;
  student: {
    id: string;
    name: string;
  };
  markedBy: {
    id: string;
    name: string;
  } | null;
};

export function ViewAttendanceDialog({
  trigger,
  className,
  sessionId,
  sessionDate,
}: ViewAttendanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchAttendance = async () => {
        setLoading(true);
        const records = await getSessionAttendance(sessionId);
        setAttendanceRecords(records);
        setLoading(false);
      };
      fetchAttendance();
    }
  }, [open, sessionId]);

  // Count students who attended
  const presentCount = attendanceRecords.filter((record) => record.attended).length;
  const totalCount = attendanceRecords.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Attendance - {day(sessionDate).format("DD/MM/YYYY")}</DialogTitle>
          <p className="text-sm text-muted-foreground">{className}</p>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="text-center text-sm text-muted-foreground py-4">
              Loading attendance...
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg mb-4">
                <div className="text-sm font-medium">
                  {presentCount} of {totalCount} students attended
                </div>

                <div className="flex items-center gap-2 text-sm text-accent">
                  <CheckCircle className="h-4 w-4" />
                  {totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}% attendance
                </div>
              </div>
              
              <div className="space-y-2">
                {attendanceRecords.map((record) => {
                  return (
                    <div
                      key={record.student.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {record.student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{record.student.name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={record.attended ?? false}
                          disabled
                          id={`student-${record.student.id}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

