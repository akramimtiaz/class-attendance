import Navigation from "@/components/navigation";
import { getCurrentUser } from "@/lib/dal";
import { redirect, notFound } from "next/navigation";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If not authenticated, redirect to signin
  if (!user) {
    redirect("/signin");
  }

  // If admin trying to access teacher routes, show 404
  if (user.role === "admin") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      {children}
    </div>
  );
}

