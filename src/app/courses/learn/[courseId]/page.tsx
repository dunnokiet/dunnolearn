import { db } from "@/db";
import { redirect } from "next/navigation";
import { eq, asc, desc, and } from "drizzle-orm";
import { courses, categories, attachments, modules, users } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import { title } from "process";
import Download from "@/components/courses/learn/attachments-download";

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
      attachments: true,
    },
  });

  if (!course) return redirect("/");

  return (
    <div className="px-4 py-12 md:px-6 lg:py-20">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            {course.title}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {course.description}
          </p>
        </div>
        {course.attachments.length !== 0 && (
          <Download attachments={course.attachments} />
        )}
      </div>
    </div>
  );
}
