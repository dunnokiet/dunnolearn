import { db } from "@/db";
import { redirect } from "next/navigation";
import { eq, asc, desc } from "drizzle-orm";
import { courses, categories, attachments } from "@/db/schema";
import { EditForm } from "@/components/courses/edit-form";
import { createClient } from "@/lib/supabase/server";
import { CustomizeCourse } from "@/components/courses/customize-course";

export default async function CourseID({ params }: { params: { id: any } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/");

  const course = await db.query.courses.findFirst({
    where: eq(courses.id, params.id),
    with: {
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
        <h1 className="text-xl font-semibold">Courses</h1>
      </header>
      <main className="flex flex-1 flex-row gap-4 p-4 lg:gap-6 lg:p-6">
        <EditForm course={course} options={options} />
        <CustomizeCourse course={course} />
      </main>
    </div>
  );
}
