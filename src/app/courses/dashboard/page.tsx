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
import { EditForm } from "@/components/courses/edit-form";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/courses/dashboard/admin-dashboard";
import StudentDashboard from "@/components/courses/dashboard/student-dashboard";

export default async function Dashboard() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const admin = await db.query.users.findFirst({
    where: and(eq(users.id, user.id), eq(users.role, "admin")),
  });

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        {admin ? <AdminDashboard /> : <StudentDashboard />}
      </main>
    </div>
  );
}
