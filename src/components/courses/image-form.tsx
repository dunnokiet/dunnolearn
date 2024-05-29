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
  PencilSquareIcon,
  PhotoIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FileUpload } from "./file-upload";
import { Label } from "../ui/label";

const formSchema = z.object({
  imageURL: z.string().min(1, {
    message: "Image is required",
  }),
});

export default function ImageForm({ course }: { course: any }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEdditing, setIsEdditing] = useState(false);

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
  };

  return (
    <CardContent>
      <Label>Image</Label>
      <div className="flex items-center space-x-2 ">
        {!isEdditing && course?.imageURL && (
          <Button
            onClick={toggleEddit}
            type="button"
            variant="outline"
            className="w-full"
          >
            <PencilSquareIcon className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}

        {!isEdditing && !course?.imageURL && (
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
          <Button
            onClick={toggleEddit}
            type="button"
            variant="destructive"
            className="w-full"
          >
            Cancel
          </Button>
        )}
      </div>
      {!isEdditing &&
        (!course?.imageURL ? (
          <div className="flex items-center justify-center h-60 bg-gray-200 rounded-md mt-2">
            <PhotoIcon className="h-10 w-10" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              src={course?.imageURL}
              className="object-cover rounded-md"
            />
          </div>
        ))}
      {isEdditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) onSubmit({ imageURL: url });
            }}
          />
        </div>
      )}
    </CardContent>
  );
}
