import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StudentDialog } from "@/components/student-dialog"
import { Plus, Search } from "lucide-react"
import { getStudents, getTotalStudentCount } from "@/db/actions/students"
import Pagination from "@/components/pagination"
import Student from "@/components/student"

export default async function StudentsPage(props: {
  searchParams: { page?: string };
}) {
  const params = await props.searchParams;
  const currentPage = Number(params?.page) || 1;
  const students = await getStudents(false, currentPage);
  const studentCount = await getTotalStudentCount();

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
            {/* <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-9" />
            </div> */}
          </div>
        </CardHeader>
        <Suspense fallback={<h1>Loading...</h1>}>
          <CardContent>
            <div className="space-y-2">
              {students.map((student) => (
                <Student key={student.id} student={student} />
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
