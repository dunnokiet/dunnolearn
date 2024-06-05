import { db } from "@/db";
import { redirect } from "next/navigation";
import { eq, asc, desc, and } from "drizzle-orm";
import { courses, categories, attachments, modules } from "@/db/schema";
import { EditForm } from "@/components/courses/edit-form";
import { createClient } from "@/lib/supabase/server";
import { CustomizeCourse } from "@/components/courses/customize-course";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default async function CourseId({ params }: { params: { id: any } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/");

  const course = await db.query.courses.findFirst({
    where: and(eq(courses.id, params.id), eq(courses.userId, user.id)),
    with: {
      modules: {
        orderBy: [desc(modules.order)],
      },
      attachments: {
        orderBy: [desc(attachments.createdAt)],
      },
    },
  });

  const options = await db.query.categories.findMany({
    orderBy: [asc(categories.name)],
  });

  if (!course) return redirect("/");

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <Link href={`/courses/`}>
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Courses</h1>
      </header>
      <main className="flex flex-1 flex-row gap-4 p-4 lg:gap-6 lg:p-6">
        <EditForm course={course} options={options} />
        <CustomizeCourse course={course} />
      </main>
    </div>
  );
}
