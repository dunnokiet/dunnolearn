"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { db } from "@/db";
import { eq, asc, desc, and } from "drizzle-orm";
import { lessons } from "@/db/schema";
import TitleForm from "./title-form";
import DescriptionForm from "./description-form";
import VideoForm from "./video-form";

export async function CustomizeLesson({ myModule }: { myModule: any }) {
  const searchParams = useSearchParams();

  const currentLessonId = searchParams.get("lessonId");

  const lesson = myModule.lessons.filter((lesson: any) => {
    return currentLessonId == lesson.id;
  });

  return (
    <div className="w-96">
      {currentLessonId && (
        <Card>
          <CardHeader>
            <CardTitle>Edit</CardTitle>
            <CardDescription>Modify lesson</CardDescription>
          </CardHeader>
          <TitleForm myModule={myModule} lesson={lesson[0]} />
          <DescriptionForm myModule={myModule} lesson={lesson[0]} />
          <VideoForm myModule={myModule} lesson={lesson[0]} />
        </Card>
      )}
    </div>
  );
}
