import { db } from "@/db";
import { redirect } from "next/navigation";
import { eq, asc, desc, and } from "drizzle-orm";
import { courses, categories, attachments, modules, users } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";

export default async function Page({
  params,
}: {
  params: { courseId: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/");

  const course = await db.query.courses.findFirst({
    where: eq(courses.id, params.courseId),
    with: {
      modules: {
        where: eq(modules.isPublished, true),
      },
    },
  });

  if (!course) return redirect("/");

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 md:p-8 lg:p-10">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{course.title}</h2>
        {/* <div className="space-y-2">
          {course.modules.map((module) => (
            <div
              key={module.id}
              className="bg-white dark:bg-gray-950 rounded-md p-4"
            >
              <h3 className="text-base font-semibold">{module.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {module.description}
              </p>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}
