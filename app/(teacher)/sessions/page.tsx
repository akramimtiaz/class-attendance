import TeacherSessionRow from "@/components/teacher-session-row";
import { getTeacherSessions, getTotalTeacherSessionsCount } from "@/db/actions/teacher-sessions";
import { getClassesByTeacher } from "@/db/actions/classes";
import Pagination from "@/components/pagination";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TeacherSessionDialog } from "@/components/teacher-session-dialog";
import { getCurrentUser } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function TeacherSessionsPage(props: {
  searchParams: { page?: string };
}) {
  const params = await props.searchParams;
  const currentPage = Number(params?.page) || 1;
  
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/signin");
  }

  const sessions = await getTeacherSessions(user.id, currentPage);
  const totalSessionsCount = await getTotalTeacherSessionsCount(user.id);
  
  // Get classes where user is the primary teacher for the "Add Session" dialog
  const teacherClasses = await getClassesByTeacher(user.id);
  const teacherClassesForDialog = teacherClasses.map((cls) => ({
    id: cls.id,
    className: cls.className,
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">My Class Sessions</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your class sessions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>All Sessions ({totalSessionsCount})</CardTitle>
            {teacherClassesForDialog.length > 0 && (
              <TeacherSessionDialog
                teacherClasses={teacherClassesForDialog}
                currentUserId={user.id}
                trigger={
                  <Button variant={"outline"} style={{ cursor: 'pointer'}}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Session
                  </Button>
                }
              />
            )}
          </div>
        </CardHeader>
        <Suspense fallback={<div className="p-6">Loading...</div>}>
          <CardContent>
            <div className="space-y-3">
              {sessions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No sessions found. Create your first session to get started.
                </div>
              ) : (
                sessions.map((session) => (
                  <TeacherSessionRow
                    key={session.id}
                    session={session}
                    currentUserId={user.id}
                  />
                ))
              )}
            </div>
            {totalSessionsCount > 0 && (
              <div className="pt-4">
                <Pagination totalItems={totalSessionsCount} />
              </div>
            )}
          </CardContent>
        </Suspense>
      </Card>
    </main>
  );
}

