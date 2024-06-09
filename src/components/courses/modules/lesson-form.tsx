"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
  DocumentPlusIcon,
  PaperClipIcon,
  PencilSquareIcon,
  PhotoIcon,
  PlusCircleIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FileUpload } from "@/components/courses/file-upload";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { attachments, modules } from "@/db/schema";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useDebouncedCallback } from "use-debounce";
import { ReloadIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
  title: z.string().min(1),
});

export default function LessonForm({ myModule }: { myModule: any }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEdditing, setIsEdditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await fetch(
        `/api/courses/${myModule.courseId}/modules/${myModule.id}/lessons`,
        {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "content-type": "application/json",
          },
        }
      );
      setIsEdditing(false);

      router.refresh();

      toast({
        description: "Added lesson",
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

  const onEdit = async (id: string) => {
    const currentLessonId = searchParams.get("lessonId");

    const isExisting = currentLessonId === id;

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          lessonId: id,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    window.location.replace(url);
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);

      await fetch(
        `/api/courses/${myModule.courseId}/modules/${myModule.id}/lessons/${id}`,
        {
          method: "DELETE",
        }
      );

      const currentLessonId = searchParams.get("lessonId");

      const isExisting = currentLessonId === id;

      const url = qs.stringifyUrl(
        {
          url: pathname,
          query: {
            lessonId: null,
          },
        },
        { skipEmptyString: true, skipNull: true }
      );

      if (isExisting) router.push(url);

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
    } finally {
      setDeletingId(null);
    }
  };

  const toggleEddit = () => {
    setIsEdditing((current) => !current);
    form.reset({ title: "" });

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          lessonId: null,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <Label>Lessons</Label>
          <div className="flex items-center space-x-2 ">
            {!isEdditing && (
              <Button
                onClick={toggleEddit}
                type="button"
                variant="outline"
                className="w-full"
              >
                <DocumentPlusIcon className="h-4 w-4 mr-2" />
                Add
              </Button>
            )}

            {isEdditing && (
              <>
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
                <Button type="submit" disabled={isSubmitting || !isValid}>
                  <PlusIcon className="h-4 w-4" />
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
          {!isEdditing && (
            <>
              {myModule.lessons.length == 0 && <p>No lessons</p>}
              {myModule.lessons.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myModule.lessons.map((lesson: any) => (
                      <TableRow key={lesson.id}>
                        <TableCell className="font-medium w-full">
                          {lesson.title}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  onEdit(lesson.id);
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  onDelete(lesson.id);
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
            // <>
            //   {course.attachments.length == 0 && <p>No attackment</p>}
            //   {course.attachments.length > 0 && (
            //     <div className="space-y-2">
            //       {course.attachments.map((attachment: any) => (
            //         <div
            //           key={attachment.id}
            //           className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
            //         >
            //           <PaperClipIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            //         </div>
            //       ))}
            //     </div>
            //   )}
            // </>
          )}
        </CardContent>
      </form>
    </Form>
  );
}
