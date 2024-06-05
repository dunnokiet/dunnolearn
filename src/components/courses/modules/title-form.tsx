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
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(2),
});

export default function TitleForm({ myModule }: { myModule: any }) {
  const router = useRouter();
  const { toast } = useToast();

  const [isEdditing, setIsEdditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: myModule?.title || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await fetch(`/api/courses/${myModule.courseId}/modules/${myModule.id}`, {
        method: "PATCH",
        body: JSON.stringify(values),
        headers: {
          "content-type": "application/json",
        },
      });
      setIsEdditing(false);

      router.refresh();

      toast({
        description: "Module updated",
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
    form.reset({ title: myModule?.title });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <FormLabel>Title</FormLabel>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-56"
                      disabled={isSubmitting || !isEdditing}
                      placeholder="Title"
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
