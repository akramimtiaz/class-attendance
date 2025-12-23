import { Button } from "@/components/ui/button";
import { ClassDialog } from "@/components/class-dialog";
import {
  Plus,
} from "lucide-react";
import ClassComponent from "@/components/class";
import { getClasses, getTotalClassesCount } from "@/db/actions/classes";

export default async function ClassesPage(props: {
  searchParams: { page?: string }
}) {
  const params = await props.searchParams;
  const currentPage = Number(params?.page) || 1;
  const classes = await getClasses(currentPage);
  const totalClassesCount = await getTotalClassesCount();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Classes</h1>
          <p className="text-muted-foreground mt-1">
            Classes ({totalClassesCount})
          </p>
        </div>
        {/* <ClassDialog
          mode="create"
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          }
        /> */}
      </div>

      <div className="space-y-4">
        {classes.map((classItem) => (
          <ClassComponent key={classItem.id} classItem={classItem} />
        ))}
      </div>
    </main>
  );
}
