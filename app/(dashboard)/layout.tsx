import Navigation from "@/components/navigation";
import { getCurrentUser } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      {children}
    </div>
  );
}