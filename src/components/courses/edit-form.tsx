"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

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
import TitleForm from "./title-form";
import DescriptionForm from "./description-form";
import ImageForm from "./image-form";
import CategoryForm from "./category-form";
import { Suspense } from "react";
import PublishForm from "./publish-form";

export function EditForm({ course, options }: { course: any; options: any }) {
  const requiredFields = [
    course.title,
    course.description,
    course.imageURL,
    course.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} / ${totalFields})`;
  return (
    <div className="w-96">
      <Card>
        <CardHeader>
          <CardTitle>Setup</CardTitle>
          <CardDescription>
            Complete all fields {completionText}
          </CardDescription>
        </CardHeader>
        <Suspense>
          <TitleForm course={course} />
          <DescriptionForm course={course} />
          <ImageForm course={course} />
          <CategoryForm
            course={course}
            options={options.map((option: any) => ({
              label: option.name,
              value: option.id,
            }))}
          />
          <PublishForm course={course} />
        </Suspense>
      </Card>
    </div>
  );
}
