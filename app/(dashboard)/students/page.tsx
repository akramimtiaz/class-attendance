import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StudentDialog } from "@/components/student-dialog"
import { Plus, Search, Eye, Pencil, Mail, Phone } from "lucide-react"
import { students } from "@/lib/constants"

export default async function StudentsPage() {
  return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Students</h1>
            <p className="text-muted-foreground mt-1">
              Manage all students across all classes
            </p>
          </div>
          <StudentDialog
            mode="create"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            }
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle>All Students ({students.length})</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {students.map((student) => (
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
                      <div className="font-semibold text-balance">
                        {student.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Parent: {student.parentName}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          {student.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          {student.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge variant="secondary" className="font-normal">
                        {student.class}
                      </Badge>
                      <span className="text-sm font-medium text-accent">
                        {student.attendance}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <StudentDialog
                        mode="view"
                        student={student}
                        trigger={
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <StudentDialog
                        mode="edit"
                        student={student}
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
