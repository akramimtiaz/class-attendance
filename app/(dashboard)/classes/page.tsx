import ClassComponent from "@/components/class";
import { getClasses, getTotalClassesCount } from "@/db/actions/classes";
import Pagination from "@/components/pagination";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ClassDialog } from "@/components/class-dialog";
import { getTeachersForAssignment } from "@/db/actions/users";

export default async function ClassesPage(props: {
  searchParams: { page?: string };
}) {
  const params = await props.searchParams;
  const currentPage = Number(params?.page) || 1;
  const classes = await getClasses(currentPage);
  const totalClassesCount = await getTotalClassesCount();
  const availableTeachers = await getTeachersForAssignment();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Classes</h1>
          <p className="text-muted-foreground mt-1">
            Manage all classes and create sessions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>All Classes ({totalClassesCount})</CardTitle>
            <ClassDialog
              availableTeachers={availableTeachers}
              trigger={
                <Button variant={"outline"} style={{ cursor: 'pointer'}}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Class
                </Button>
              }
            />
          </div>
        </CardHeader>
        <Suspense fallback={<h1>Loading...</h1>}>
          <CardContent>
            <div className="space-y-4">
              {classes.map((classItem) => (
                <ClassComponent key={classItem.id} classItem={classItem} availableTeachers={availableTeachers} />
              ))}
            </div>
            <div className="pt-4">
              <Pagination totalItems={totalClassesCount} />
            </div>
          </CardContent>
        </Suspense>
      </Card>
    </main>
  );
}
