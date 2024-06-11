import { SideNav } from "@/components/courses/sidenav";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { eq, asc, desc, and, count, sql, ConsoleLogWriter } from "drizzle-orm";
import {
  courses,
  categories,
  attachments,
  modules,
  users,
  enrolments,
} from "@/db/schema";
import { createClient } from "@/lib/supabase/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const admin = await db.query.users.findFirst({
    where: and(eq(users.id, user.id), eq(users.role, "admin")),
  });

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <SideNav role={admin ? "admin" : "student"} />
      </div>
      {children}
    </div>
  );
}
