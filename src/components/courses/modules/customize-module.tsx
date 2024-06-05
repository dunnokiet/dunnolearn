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
import LessonForm from "./lesson-form";

export function CustomizeModule({ myModule }: { myModule: any }) {
  return (
    <div className="w-96">
      <Card>
        <CardHeader>
          <CardTitle>Customize</CardTitle>
          <CardDescription>Modify modules</CardDescription>
        </CardHeader>
        <LessonForm myModule={myModule} />
      </Card>
    </div>
  );
}
