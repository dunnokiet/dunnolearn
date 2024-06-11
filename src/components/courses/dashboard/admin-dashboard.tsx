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
import { ChevronLeft } from "lucide-react";
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

export async function AdminDashboard() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const TotalCourses = await db.select({ count: count() }).from(courses);

  const TotalCoursesFromThisMonth = await db.execute(
    sql`SELECT COUNT(*) FROM public.courses WHERE DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE);`
  );

  const TotalCoursesFromLastMonth = await db.execute(
    sql`SELECT COUNT(*) FROM public.courses WHERE DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')`
  );

  const RecentEnrolmentsLimit5 = await db.query.enrolments.findMany({
    orderBy: desc(enrolments.EnrolmentDate),
    with: {
      users: true,
      courses: true,
    },
    limit: 5,
  });

  const RecentCompletedLimit5 = await db.execute(
    sql`
    SELECT
  u."firstName",
  u."lastName",
  u.email
FROM
  public.users u
WHERE
  u.id IN (
    SELECT
      up."userId"
    FROM
      public.users_progress up
      JOIN public.lessons l ON up."lessonId" = l.id
      JOIN public.modules m ON l."moduleId" = m.id
    GROUP BY
      up."userId"
    HAVING
      COUNT(DISTINCT l.id) = (
        SELECT
          COUNT(id)
        FROM
          public.lessons
        WHERE
          "moduleId" IN (
            SELECT
              id
            FROM
              public.modules
          )
      )
  );
    `
  );

  const TotalCompletesThisMonth = await db.execute(
    sql`
    SELECT COUNT(*) AS "totalCompleted" FROM public.users u JOIN public.users_progress up ON u.id = up."userId" JOIN public.lessons l ON up."lessonId" = l.id JOIN public.modules m ON l."moduleId" = m.id JOIN public.courses c ON m."courseId" = c.id WHERE up."isCompleted" = TRUE AND DATE_TRUNC('month', up."updatedAt") = DATE_TRUNC('month', CURRENT_DATE) GROUP BY u.id, c.id, c.title, up."updatedAt" HAVING COUNT(DISTINCT up."lessonId") = ( SELECT COUNT(l.id) FROM public.lessons l );
    `
  );

  const TotalCompletesLastMonth = await db.execute(
    sql`
    SELECT COUNT(*) AS "totalCompleted" FROM public.users u JOIN public.users_progress up ON u.id = up."userId" JOIN public.lessons l ON up."lessonId" = l.id JOIN public.modules m ON l."moduleId" = m.id JOIN public.courses c ON m."courseId" = c.id WHERE up."isCompleted" = TRUE AND DATE_TRUNC('month', up."updatedAt") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') GROUP BY u.id, c.id, c.title, up."updatedAt" HAVING COUNT(DISTINCT up."lessonId") = ( SELECT COUNT(l.id) FROM public.lessons l );
    `
  );

  const TotalCompletes = await db.execute(
    sql`
    select count_completed_courses ();
    `
  );

  const UserThisMonth = await db.execute(
    sql`
    SELECT COUNT(*) FROM public.users WHERE EXTRACT( MONTH FROM joined_at ) = EXTRACT( MONTH FROM CURRENT_DATE ) AND EXTRACT( YEAR FROM joined_at ) = EXTRACT( YEAR FROM CURRENT_DATE );
    `
  );

  const UserLastmonth = await db.execute(
    sql`
    SELECT COUNT(*) FROM public.users WHERE EXTRACT( MONTH FROM joined_at ) = EXTRACT( MONTH FROM CURRENT_DATE - INTERVAL '1 month' ) AND EXTRACT( YEAR FROM joined_at ) = EXTRACT( YEAR FROM CURRENT_DATE - INTERVAL '1 month' );
    `
  );

  const UserTotal = await db.execute(
    sql`
    SELECT COUNT(*) FROM public.users;
    `
  );

  const Top5Courses = await db.execute(
    sql`
    SELECT c."createdAt" AS "courseCreatedAt",c.title AS "courseTitle", COUNT(e."courseId") AS "enrolmentCount" FROM public.courses c LEFT JOIN public.enrolments e ON c.id = e."courseId" GROUP BY c.title, c."createdAt" HAVING COUNT(e."courseId") > 0 ORDER BY COUNT(e."courseId") DESC LIMIT 5;
    `
  );

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <TotalCoursesCard
          count={TotalCourses[0].count}
          thisMonth={Number(TotalCoursesFromThisMonth[0].count)}
          lastMonth={Number(TotalCoursesFromLastMonth[0].count)}
        />
        <SubscriptionsCard
          count={Number(UserTotal[0].count)}
          thisMonth={Number(UserThisMonth[0].count)}
          lastMonth={Number(UserLastmonth[0].count)}
        />
        <CompletesCard
          count={TotalCompletes[0].count_completed_courses}
          thisMonth={
            TotalCompletesThisMonth.length !== 0
              ? Number(TotalCompletesThisMonth[0]?.totalCompleted!)
              : 0
          }
          lastMonth={
            TotalCompletesLastMonth.length !== 0
              ? Number(TotalCompletesLastMonth[0]?.totalCompleted!)
              : 0
          }
        />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <EnrolmentsCard RecentEnrolments={RecentEnrolmentsLimit5} />
        <RecentCompleted data={RecentCompletedLimit5} />
        <TopCoursesCard data={Top5Courses} />
      </div>
    </>
  );
}
