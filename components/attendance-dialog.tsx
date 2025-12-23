"use client";

import type React from "react";

import { useState } from "react";
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
import { ClassWithSessions } from "@/db/actions/classes";

type AttendanceDialogProps = {
  trigger: React.ReactNode;
  className: string;
  students: ClassWithSessions["classStudents"];
};

export function AttendanceDialog({ trigger, students, className }: AttendanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [toggleAllEnabled, setToggleAllEnabled] = useState<boolean>(false);
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    Object.fromEntries(students.map((s) => [s.student.id, false]))
  );

  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const onToggleAll = () => {
    setToggleAllEnabled(!toggleAllEnabled);
    setAttendance((prev) =>
      Object.fromEntries(
        Object.keys(prev).map((key) => [key, !toggleAllEnabled])
      )
    );
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalCount = students.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
          <p className="text-sm text-muted-foreground">{className}</p>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div className="text-sm font-medium">
              {presentCount} of {totalCount} students present
            </div>

            <div className="flex items-center gap-2 text-sm text-accent">
              <CheckCircle className="h-4 w-4" />
              {Math.round((presentCount / totalCount) * 100)}% attendance
            </div>
          </div>
          <div className="my-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={toggleAllEnabled}
                onCheckedChange={onToggleAll}
              />
              <label className="text-sm text-muted-foreground cursor-pointer">
                All Students Present
              </label>
            </div>
          </div>
          <div className="space-y-2">
            {students.map((s) => (
              <div
                key={s.student.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>
                      {s.student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{s.student.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={attendance[s.student.id]}
                    onCheckedChange={() => toggleAttendance(s.student.id)}
                    id={`student-${s.student.id}`}
                  />
                  <label
                    htmlFor={`student-${s.student.id}`}
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Present
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save Attendance</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
