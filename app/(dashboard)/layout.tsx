import Navigation from "@/components/navigation";
import { getCurrentUser } from "@/lib/dal";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      {children}
    </div>
  );
}