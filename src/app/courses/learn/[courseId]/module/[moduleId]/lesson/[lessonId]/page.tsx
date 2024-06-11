import { db } from "@/db";
import { redirect } from "next/navigation";
import { eq, asc, desc, and, param } from "drizzle-orm";
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
    preLesson,
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
    // <div className="flex flex-col max-w-4xl mx-auto pb-20">
    //   <div className="p-4">
    //     <Player src={lesson.videoURL!} />
    //   </div>
    //   <div>
    //     <div className="p-4 flex flex-col md:flex-row items-center justify-between">
    //       <h2 className="w-full text-2xl font-semibold">{lesson.title}</h2>
    //       <CourseProgressButton
    //         courseId={params.courseId}
    //         moduleId={params.moduleId}
    //         lessonId={params.lessonId}
    //         nextLessonId={nextLesson?.id}
    //         isCompleted={!!user_progess?.isCompleted}
    //       />
    //       <Preview value={lesson.description!} />
    //     </div>
    //   </div>
    // </div>
    <div className="w-full max-w-4xl mx-auto py-12 md:py-16 lg:py-20 px-4 md:px-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
            <Preview value={lesson.description!} />
          </p>
        </div>
        <div className="w-full aspect-video rounded-lg overflow-hidden">
          <video controls className="w-full h-full object-cover">
            <source src={lesson.videoURL!} type="video/mp4" />
          </video>
        </div>
        <div className="flex justify-between items-center">
          {preLesson ? (
            <Link
              href={`/courses/learn/${params.courseId}/module/${params.moduleId}/lesson/${preLesson.id}`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              prefetch={false}
            >
              Previous Lesson
            </Link>
          ) : (
            <div></div>
          )}
          <div className="flex items-center space-x-4">
            <CourseProgressButton
              courseId={params.courseId}
              moduleId={params.moduleId}
              lessonId={params.lessonId}
              nextLessonId={nextLesson?.id}
              isCompleted={!!user_progess?.isCompleted}
            />
            {nextLesson && (
              <Link
                href={`/courses/learn/${params.courseId}/module/${params.moduleId}/lesson/${nextLesson.id}`}
                className="inline-flex h-10 items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                prefetch={false}
              >
                Next Lesson
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
