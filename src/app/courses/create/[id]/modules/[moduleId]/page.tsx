import { db } from "@/db";
import { redirect } from "next/navigation";
import { eq, asc, desc, and } from "drizzle-orm";
import { courses, categories, attachments, modules } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";

export default async function ModuleId({
  params,
}: {
  params: { id: any; moduleId: any };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/");

  const myModule = await db.query.modules.findFirst({
    where: and(eq(courses.id, params.id), eq(modules.id, params.moduleId)),
  });

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <h1 className="text-xl font-semibold">Modules</h1>
      </header>
      <main className="flex flex-1 flex-row gap-4 p-4 lg:gap-6 lg:p-6">
        TEST
      </main>
    </div>
  );
}
