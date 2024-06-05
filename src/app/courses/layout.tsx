import { SideNav } from "@/components/courses/sidenav";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <SideNav />
      </div>
      <Suspense>{children}</Suspense>
    </div>
  );
}
