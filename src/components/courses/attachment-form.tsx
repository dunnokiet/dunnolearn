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
  DocumentPlusIcon,
  PaperClipIcon,
  PencilSquareIcon,
  PhotoIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FileUpload } from "./file-upload";
import { Label } from "../ui/label";
import Component from "../ui/test";
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
import { attachments } from "@/db/schema";

const formSchema = z.object({
  URL: z.string().min(1, {
    message: "URL is required",
  }),
});

export default function AttachmentForm({ course }: { course: any }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEdditing, setIsEdditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await fetch(`/api/courses/${course.id}/attachments`, {
        method: "POST",
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

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);

      await fetch(`/api/courses/${course.id}/attachments/${id}`, {
        method: "DELETE",
      });

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
    } finally {
      setDeletingId(null);
    }
  };

  const toggleEddit = () => {
    setIsEdditing((current) => !current);
  };

  return (
    <CardContent>
      <Label>Attachments</Label>
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
          <Button
            onClick={toggleEddit}
            type="button"
            variant="destructive"
            className="w-full"
          >
            Cancel
          </Button>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) onSubmit({ URL: url });
            }}
          />
        </>
      )}
      {!isEdditing && (
        <>
          {course.attachments.length == 0 && <p>No attackments</p>}
          {course.attachments.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course.attachments.map((attachment: any) => (
                  <TableRow key={attachment.id}>
                    <TableCell className="font-medium w-full">
                      {attachment.name}
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
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              onDelete(attachment.id);
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
      )}
    </CardContent>
  );
}
