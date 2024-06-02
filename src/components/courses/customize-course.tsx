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
import AttachmentForm from "./attachment-form";
import ModuleForm from "./module-form";

export function CustomizeCourse({ course }: { course: any }) {
  return (
    <div className="w-96">
      <Card>
        <CardHeader>
          <CardTitle>Customize</CardTitle>
          <CardDescription>Modify coures</CardDescription>
        </CardHeader>
        <ModuleForm course={course} />
        {/* <AttachmentForm course={course} /> */}
      </Card>
    </div>
  );
}
