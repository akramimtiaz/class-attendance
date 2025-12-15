import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  CheckCircle,
  XCircle,
  BookOpen,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Dashboard() {
  const students = [];
  const teachers = [];
  const presentCount = 0;
  const absentCount = 0;
  const recentAttendance = [];

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of attendance and class information
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">57</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Teachers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active instructors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Classes
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">
              Running this term
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Attendance
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Class Attendance</CardTitle>
            <p className="text-sm text-muted-foreground">
              Most recent class session - Saturday, Dec 14
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-6 p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                <div>
                  <div className="text-2xl font-bold">{presentCount}</div>
                  <div className="text-xs text-muted-foreground">Present</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                <div>
                  <div className="text-2xl font-bold">{absentCount}</div>
                  <div className="text-xs text-muted-foreground">Absent</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {recentAttendance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">
                        {record.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{record.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {record.class}
                      </div>
                    </div>
                  </div>
                  {record.status === "present" ? (
                    <CheckCircle className="h-5 w-5 text-accent" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Teachers & Students Lists */}
        <div className="space-y-6">
          {/* Teachers */}
          <Card>
            <CardHeader>
              <CardTitle>Teachers</CardTitle>
              <p className="text-sm text-muted-foreground">
                Active instructors
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {teacher.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {teacher.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {teacher.classes}{" "}
                          {teacher.classes === 1 ? "class" : "classes"} •{" "}
                          {teacher.students} students
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Students */}
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <p className="text-sm text-muted-foreground">
                Recent student list
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {student.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {student.class}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-accent">
                      {student.attendance}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
