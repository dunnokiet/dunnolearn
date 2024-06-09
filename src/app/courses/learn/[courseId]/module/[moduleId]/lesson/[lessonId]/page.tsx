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
} from "@/db/schema";
import { EditForm } from "@/components/courses/edit-form";
import { createClient } from "@/lib/supabase/server";
import { CustomizeCourse } from "@/components/courses/customize-course";
import { columns } from "@/components/courses/columns";
import { DataTable } from "@/components/courses/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { unstable_noStore as noStore } from "next/cache";
import { getLesson } from "@/lib/get-lesson";
import Player from "next-video/player";
import Preview from "@/components/courses/preview";
import CourseProgressButton from "@/components/courses/learn/course-progress-button";

export default async function Page({
  params,
}: {
  params: { courseId: string; moduleId: string; lessonId: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/");

  const {
    lesson,
    myModule,
    course,
    videoURL,
    attachments,
    nextLesson,
    user_progess,
    enrolment,
  } = await getLesson({
    userId: user.id,
    courseId: params.courseId,
    moduleId: params.moduleId,
    lessonId: params.lessonId,
  });

  if (!myModule || !course || !lesson) return redirect("/");

  if (!enrolment) return redirect(`/courses/learn/${course.id}`);

  const completeOnEnd = !!enrolment && !user_progess?.isCompleted;

  return (
    <div className="flex flex-col max-w-4xl mx-auto pb-20">
      <div className="p-4">
        <Player src={lesson.videoURL!} />
      </div>
      <div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="w-full text-2xl font-semibold">{lesson.title}</h2>
          <CourseProgressButton
            courseId={params.courseId}
            moduleId={params.moduleId}
            lessonId={params.lessonId}
            nextLessonId={nextLesson?.id}
            isCompleted={!!user_progess?.isCompleted}
          />
          <Preview value={lesson.description!} />
        </div>
      </div>
    </div>
  );
}
