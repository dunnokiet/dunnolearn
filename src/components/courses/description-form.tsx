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
import { useState } from "react";

const formSchema = z.object({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

export default function DescriptionForm({ course }: { course: any }) {
  const router = useRouter();
  const { toast } = useToast();

  const [isEdditing, setIsEdditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: course?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await fetch(`/api/courses/${course.id}`, {
        method: "PATCH",
        body: JSON.stringify(values),
        headers: {
          "content-type": "application/json",
        },
      });
      setIsEdditing(false);

      router.refresh();

      toast({
        description: "Course updated",
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
    form.reset({ description: course?.description });
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
                    <Textarea
                      className="w-56 h-20"
                      disabled={isSubmitting || !isEdditing}
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {!isEdditing ? (
              <Button
                onClick={toggleEddit}
                type="button"
                variant="outline"
                className="w-full"
              >
                <PencilSquareIcon className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <>
                <Button type="submit" disabled={isSubmitting || !isValid}>
                  <CheckIcon className="h-4 w-4" />
                </Button>
                <Button
                  onClick={toggleEddit}
                  type="button"
                  variant="destructive"
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </form>
    </Form>
  );
}
