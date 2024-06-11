"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
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
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
  CheckIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { PgRefreshMaterializedView } from "drizzle-orm/pg-core";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  isPublished: z.boolean(),
});

export default function PublishForm({
  myModule,
  lesson,
}: {
  myModule: any;
  lesson: any;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPublished: lesson?.isPublished || false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await fetch(
        `/api/courses/${myModule.courseId}/modules/${myModule.id}/lessons/${lesson.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(values),
          headers: {
            "content-type": "application/json",
          },
        }
      );

      router.refresh();

      toast({
        description: "Lesson updated",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Publish</FormLabel>
                    <FormDescription>
                      To make lesson available to people and enrolment.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      type="submit"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </form>
    </Form>
  );
}
