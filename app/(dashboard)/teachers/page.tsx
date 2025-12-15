import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TeacherDialog } from "@/components/teacher-dialog";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Mail,
  Phone,
  BookOpen,
  Users,
} from "lucide-react";
import { teachers } from "@/lib/constants";

export default async function TeachersPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Teachers</h1>
          <p className="text-muted-foreground mt-1">
            Manage all instructors across all classes
          </p>
        </div>
        <TeacherDialog
          mode="create"
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          }
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>All Teachers ({teachers.length})</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search teachers..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-lg border hover:bg-secondary/50 transition-colors gap-4"
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
                    <Badge variant="secondary" className="mt-1 font-normal">
                      {teacher.specialization}
                    </Badge>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {teacher.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {teacher.phone}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {teacher.classes.map((className, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="font-normal text-xs"
                        >
                          {className}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 lg:gap-6 shrink-0">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <div className="text-center">
                        <div className="text-xl font-bold">
                          {teacher.activeClasses}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Classes
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="text-center">
                        <div className="text-xl font-bold">
                          {teacher.totalStudents}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Students
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <TeacherDialog
                      mode="view"
                      teacher={teacher}
                      trigger={
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <TeacherDialog
                      mode="edit"
                      teacher={teacher}
                      trigger={
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
