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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  CheckIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Editor from "../../editor";

const formSchema = z.object({
  description: z.string().min(1),
});

export default function DescriptionForm({
  myModule,
  lesson,
}: {
  myModule: any;
  lesson: any;
}) {
  const router = useRouter();

  const { toast } = useToast();

  const [isEdditing, setIsEdditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: lesson?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

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
      setIsEdditing(false);

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

  const toggleEddit = () => {
    setIsEdditing((current) => !current);
    form.reset({ description: lesson?.description });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <FormLabel>Description</FormLabel>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button
            className="mt-2"
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            Save
          </Button>
        </CardContent>
      </form>
    </Form>
  );
}
