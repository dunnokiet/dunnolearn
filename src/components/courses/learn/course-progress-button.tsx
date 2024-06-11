"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useConfettiStore } from "@/lib/use-confetti-store";
import { ToastAction } from "@radix-ui/react-toast";
import { ChevronRight, CircleCheckBig, Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CourseProgressButton({
  moduleId,
  lessonId,
  courseId,
  isCompleted,
  nextLessonId,
  preLessonId,
}: {
  moduleId: string;
  lessonId: string;
  courseId: string;
  isCompleted?: boolean;
  nextLessonId?: string;
  preLessonId?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const confetti = useConfettiStore();
  const { toast } = useToast();

  const onClick = async () => {
    try {
      setIsLoading(true);

      await fetch(
        `/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/progress`,
        {
          method: "PUT",
          body: JSON.stringify({ isCompleted: !isCompleted }),
          headers: {
            "content-type": "application/json",
          },
        }
      );

      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading}
      onClick={onClick}
      type="button"
      variant="outline"
    >
      {isCompleted ? "Not completed" : "Mark as Complete"}
    </Button>
  );
}
