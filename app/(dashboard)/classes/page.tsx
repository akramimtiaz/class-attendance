
import { Button } from "@/components/ui/button";
import { ClassDialog } from "@/components/class-dialog";
import {
  Plus,
} from "lucide-react";
import { classes } from "@/lib/constants";

export default function ClassesPage(props: {
  searchParams: { page?: string }
}) {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Classes</h1>
          <p className="text-muted-foreground mt-1">
            Manage classes, sessions, and attendance
          </p>
        </div>
        <ClassDialog
          mode="create"
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          }
        />
      </div>

      <div className="space-y-4">
        {classes.map((classItem) => (
        ))}
      </div>
    </main>
  );
}
