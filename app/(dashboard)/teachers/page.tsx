import Pagination from "@/components/pagination";
import Teacher from "@/components/teacher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeachers, getTotalTeachersCount } from "@/db/actions/users";
import { Suspense } from "react";

export default async function TeachersPage(props: {
  searchParams: { page?: string };
}) {
  const params = await props.searchParams;
  const currentPage = Number(params?.page) || 1;
  const teachers = await getTeachers(currentPage);
  const teachersCount = await getTotalTeachersCount();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Teachers</h1>
          <p className="text-muted-foreground mt-1">
            Manage all instructors across all classes
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>All Teachers ({teachersCount})</CardTitle>
            {/* <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search teachers..." className="pl-9" />
            </div> */}
          </div>
        </CardHeader>
        <Suspense fallback={<h1>Loading...</h1>}>
          <CardContent>
            <div className="space-y-2">
              {teachers.map((teacher) => (
                <Teacher key={teacher.id} teacher={teacher} />
              ))}
            </div>
            <div className="pt-4">
              <Pagination totalItems={teachersCount} />
            </div>
          </CardContent>
        </Suspense>
      </Card>
    </main>
  );
}
