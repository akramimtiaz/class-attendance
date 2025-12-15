import Navigation from "@/app/components/navigation";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {children}
    </div>
  );
}