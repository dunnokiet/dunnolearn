import { ChevronRightIcon } from "lucide-react";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { eq, asc, desc, and } from "drizzle-orm";
import {
  courses,
  categories,
  attachments,
  modules,
  users,
  lessons,
  users_progress,
  enrolments,
} from "@/db/schema";

import { createClient } from "@/lib/supabase/server";

import Categories from "@/components/search/categories";

import { Suspense, useState } from "react";
import SearchInput from "@/components/search/search-input";
import { getCourses } from "@/lib/get-courses";
import { CourseList } from "@/components/search/course-list";
import CourseId from "../../[id]/page";
import { getProgress } from "@/lib/get-progress";
import { CourseSidebar } from "@/components/courses/learn/course-sidebar";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
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
        with: {
          lessons: {
            where: eq(lessons.isPublished, true),
            with: {
              users_progress: {
                where: eq(users_progress.userId, user.id),
              },
            },
            orderBy: asc(lessons.order),
          },
        },
        orderBy: asc(modules.order),
      },
    },
  });

  if (!course) return redirect("/");

  const enrolment = await db.query.enrolments.findFirst({
    where: and(
      eq(enrolments.userId, user.id),
      eq(enrolments.courseId, course.id)
    ),
  });

  const progressCount = await getProgress(user.id, course.id);

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <h1 className="text-xl font-semibold">Courses</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex">
          <div className="w-[500px]">
            <CourseSidebar
              course={course}
              progress={progressCount}
              enrolment={enrolment}
            />
          </div>
          <div className="w-full h-3">{children}</div>
        </div>
      </main>
    </div>
  );
}
