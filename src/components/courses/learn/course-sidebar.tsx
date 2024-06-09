"use client";

import {
  ChevronRightIcon,
  CircleCheckBig,
  CircleDashed,
  CircleDashedIcon,
  Router,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useState } from "react";
import { enrolments } from "@/db/schema";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

export function CourseSidebar({
  course,
  progress,
  enrolment,
}: {
  course: any;
  progress: any;
  enrolment: any;
}) {
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const onEnrol = async () => {
    try {
      setLoading(true);

      await fetch(`/api/courses/${course.id}/enrolments/`, {
        method: "POST",
      })
        .then((response) => response.json())
        .then((json) => {
          window.location.assign(json.courseId);
        });
    } catch {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setLoading(false);
    }
  };

  const onClick = (moduleId: string, lessonId: string) => {
    router.push(
      `/courses/learn/${course.id}/module/${moduleId}/lesson/${lessonId}`
    );
  };

  return (
    <div className="rounded-lg p-6 md:p-8 lg:p-10">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          <Link href={`/courses/learn/${course.id}`}>{course.title}</Link>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{course.description}</p>
        {!enrolment ? (
          <Button disabled={isLoading} onClick={onEnrol} className="w-full">
            Enroll
          </Button>
        ) : (
          <Progress value={progress} />
        )}
      </div>
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">Modules</h2>
        <div className="space-y-2">
          <Accordion type="single" collapsible className="w-full">
            {course.modules.flatMap(
              (module: any) =>
                module.isPublished && (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger>{module.title}</AccordionTrigger>
                    {module.lessons.map(
                      (lesson: any) =>
                        lesson.isPublished && (
                          <AccordionContent
                            className="hover:underline "
                            key={lesson.id}
                          >
                            <div className="flex flex-row">
                              {enrolment &&
                                !lesson.users_progress[0]?.isCompleted! && (
                                  <CircleDashed className="w-5 h-5 flex-shrink-0 mr-2" />
                                )}
                              {enrolment &&
                                lesson.users_progress[0]?.isCompleted! && (
                                  <CircleCheckBig
                                    color="blue "
                                    className="w-5 h-5 flex-shrink-0 mr-2"
                                  />
                                )}
                              <button
                                disabled={!enrolment}
                                onClick={() => onClick(module.id, lesson.id)}
                                className="text-start"
                              >
                                {lesson.title}
                              </button>
                            </div>
                          </AccordionContent>
                        )
                    )}
                  </AccordionItem>
                )
            )}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
