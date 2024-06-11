import { db } from "@/db";
import { redirect } from "next/navigation";
import { eq, asc, desc, and, count, sql, ConsoleLogWriter } from "drizzle-orm";
import {
  courses,
  categories,
  attachments,
  modules,
  users,
  enrolments,
} from "@/db/schema";
import { EditForm } from "@/components/courses/edit-form";
import { createClient } from "@/lib/supabase/server";
import { CustomizeCourse } from "@/components/courses/customize-course";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock } from "lucide-react";
import { Suspense } from "react";
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CompletesCard,
  EnrolmentsCard,
  RecentCompleted,
  SubscriptionsCard,
  TopCoursesCard,
  TotalCoursesCard,
} from "@/components/courses/dashboard/dashboard-card";
import { CourseList } from "@/components/search/course-list";
import { getDashboardCourses } from "@/lib/get-dashboard-courses";
import InfoCard from "./info-card";

export default async function StudentDashboard() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    user.id
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          Icon={Clock}
          label="In Progress"
          count={coursesInProgress.length}
          color="blue"
        />
        <InfoCard
          Icon={Clock}
          label="Completed"
          count={completedCourses.length}
          color="green"
        />
      </div>
      <CourseList items={[...coursesInProgress, ...completedCourses]} />
    </>
  );
}
