"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
  DocumentPlusIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { FileUpload } from "../../file-upload";
import { Label } from "@/components/ui/label";
import { VideoIcon } from "lucide-react";
import Video from "next-video";

const formSchema = z.object({
  videoURL: z.string().min(1),
});

export default function VideoForm({
  myModule,
  lesson,
}: {
  myModule: any;
  lesson: any;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEdditing, setIsEdditing] = useState(false);

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
        description: "lesson updated",
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
      <Label>Video</Label>
      <div className="flex items-center space-x-2 ">
        {!isEdditing && lesson?.videoURL && (
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

        {!isEdditing && !lesson?.videoURL && (
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
        (!lesson?.videoURL ? (
          <div className="flex items-center justify-center h-60 bg-gray-200 rounded-md mt-2">
            <VideoIcon className="h-10 w-10" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Video src={lesson.videoURL} />
          </div>
        ))}
      {isEdditing && (
        <div>
          <FileUpload
            endpoint="videoModule"
            onChange={(url) => {
              if (url) onSubmit({ videoURL: url });
            }}
          />
        </div>
      )}
    </CardContent>
  );
}
