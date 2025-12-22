
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TeacherDialog } from "@/components/teacher-dialog";
import {
  Eye,
  Mail,
  Phone,
  BookOpen,
  Users,
} from "lucide-react";
import type { TeacherWithClasses } from "@/db/actions/users";

type TeacherProps = {
    teacher: TeacherWithClasses
};

export default function Teacher({ teacher }: TeacherProps) {
  const { classesAssigned } = teacher;
  const classesCount = classesAssigned.length;
  const studentsCount = classesAssigned.reduce(
    (acc, ca) => acc + ca.classStudents.length,
    0
  );

  return (
    <div
      key={teacher.id}
      className="flex flex-col lg:flex-row lg:items-center between p-4 rounded-lg border hover:bg-secondary/50 transition-colors gap-4"
    >
      <div className="flex items-start gap-4 min-w-0 flex-1">
        <Avatar className="h-14 w-14 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {teacher.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-lg text-balance">
            {teacher.name}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {teacher.email}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              {teacher.phoneNumber}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {teacher.classesAssigned.map((ca, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="font-normal text-xs"
              >
                {ca.className}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 lg:gap-6 ">
        <div className="flex gap-6">
          <div className="flex items-center gap-2 min-h-[85px]">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <div className="text-center">
              <div className="text-xl font-bold">{classesCount}</div>
              <div className="text-xs text-muted-foreground">Classes</div>
            </div>
          </div>
          <div className="flex items-center gap-2 min-h-[85px]">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="text-center">
              <div className="text-xl font-bold">{studentsCount}</div>
              <div className="text-xs text-muted-foreground">Students</div>
            </div>
          </div>
        </div>

        <div className="">
          <TeacherDialog
            mode="view"
            teacher={teacher}
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