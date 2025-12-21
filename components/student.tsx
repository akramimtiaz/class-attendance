// "use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StudentDialog } from "@/components/student-dialog";
import { Eye } from "lucide-react";
import { Badge } from "./ui/badge";
import type { StudentWithClasses } from "@/db/actions/students";

type StudentProps = {
  student: StudentWithClasses;
};

export default function Student({ student }: StudentProps) {
  const classes = student.classStudents.map(cs => cs.class);

  return (
    <div
      key={student.id}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:bg-secondary/50 transition-colors gap-4"
    >
      <div className="flex items-center gap-4 min-w-0">
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarFallback>
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-balance">{student.name}</div>
          <div className="text-sm text-muted-foreground">
            Parent: {student.guardianName} ({student.guardianContact})
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <div className="flex flex-row gap-3">
          {classes.map((c) => (
            <Badge key={c.id}>{c.className}</Badge>
          ))}
          {!classes.length && (
            <Badge variant={'secondary'}>Not Enrolled</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <StudentDialog
            defaultMode="view"
            student={student}
            trigger={
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
