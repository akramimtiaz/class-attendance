import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getStudents, getTotalStudentCount } from "@/db/actions/students"
import Pagination from "@/components/pagination"
import Student from "@/components/student"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { StudentDialog } from "@/components/student-dialog"
import { getClassesAvailableForAssignment } from "@/db/actions/classes"

export default async function StudentsPage(props: {
  searchParams: { page?: string };
}) {
  const params = await props.searchParams;
  const currentPage = Number(params?.page) || 1;
  const students = await getStudents(false, currentPage);
  const studentCount = await getTotalStudentCount();
  const availableClasses = await getClassesAvailableForAssignment();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage all students across all classes
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>All Students ({studentCount})</CardTitle>
            <StudentDialog
              availableClasses={availableClasses}
              trigger={
                <Button variant={"outline"} style={{ cursor: 'pointer'}}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              }
            />
          </div>
        </CardHeader>
        <Suspense fallback={<h1>Loading...</h1>}>
          <CardContent>
            <div className="space-y-2">
              {students.map((student) => (
                <Student key={student.id} student={student} availableClasses={availableClasses} />
              ))}
            </div>
            <div className="pt-4">
              <Pagination totalItems={studentCount} />
            </div>
          </CardContent>
        </Suspense>
      </Card>
    </main>
  );
}
