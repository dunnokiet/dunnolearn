import { db } from "@/db";
import { redirect } from "next/navigation";
import { eq, asc, desc, and } from "drizzle-orm";
import { courses, categories, attachments, modules, users } from "@/db/schema";
import { EditForm } from "@/components/courses/edit-form";
import { createClient } from "@/lib/supabase/server";
import { CustomizeCourse } from "@/components/courses/customize-course";
import { columns } from "@/components/courses/columns";
import { DataTable } from "@/components/courses/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

export default async function CoursePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/");

  const data = await db.query.courses.findMany({
    where: eq(courses.userId, user.id),
    orderBy: [desc(courses.createdAt)],
    with: {
      users: true,
      categories: true,
    },
  });

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <h1 className="text-xl font-semibold">Courses</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        {data.length <= 0 ? (
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no courses
              </h3>
              <p className="text-sm text-muted-foreground">
                You can start teaching as soon as you add a course.
              </p>
              <Link href="/courses/create">
                <Button className="mt-4">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New course
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </main>
    </div>
  );
}
