import { db } from "@/db";
import { redirect } from "next/navigation";
import { eq, asc, desc, and, count } from "drizzle-orm";
import { courses, categories, attachments, modules } from "@/db/schema";
import { EditForm } from "@/components/courses/edit-form";
import { createClient } from "@/lib/supabase/server";
import { CustomizeCourse } from "@/components/courses/customize-course";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Book, ChevronLeft, SquareCheck } from "lucide-react";
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

export function TotalCoursesCard({
  count,
  thisMonth,
  lastMonth,
}: {
  count: any;
  thisMonth: any;
  lastMonth: any;
}) {
  const percentage =
    ((thisMonth + 1 - (lastMonth + 1)) / (lastMonth + 1)) * 100;

  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total courses</CardTitle>
        <Book className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">
          +{percentage}% from last month
        </p>
      </CardContent>
    </Card>
  );
}

export function EnrolmentsCard({
  RecentEnrolments,
}: {
  RecentEnrolments: any;
}) {
  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Enrolments</CardTitle>
          <CardDescription>
            Recent enrolments from your website.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="#">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead className="hidden xl:table-column">Type</TableHead>
              <TableHead className="hidden xl:table-column">Status</TableHead>
              <TableHead className="hidden xl:table-column">Date</TableHead>
              <TableHead className="text-right">Course</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RecentEnrolments.map((enrolment: any) => (
              <TableRow key={enrolment.id}>
                <TableCell>
                  <div className="font-medium">
                    {enrolment.users.firstName + " " + enrolment.users.lastName}
                  </div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {enrolment.users.email}
                  </div>
                </TableCell>
                <TableCell className="hidden xl:table-column">Sale</TableCell>
                <TableCell className="hidden xl:table-column">
                  <Badge className="text-xs" variant="outline">
                    Approved
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                  2023-06-23
                </TableCell>
                <TableCell className="text-right">
                  {enrolment.courses.title}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function SubscriptionsCard({
  count,
  thisMonth,
  lastMonth,
}: {
  count: any;
  thisMonth: any;
  lastMonth: any;
}) {
  const percentage =
    ((thisMonth + 1 - (lastMonth + 1)) / (lastMonth + 1)) * 100;
  return (
    <Card x-chunk="dashboard-01-chunk-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+{count}</div>
        <p className="text-xs text-muted-foreground">
          +{percentage} from last month
        </p>
      </CardContent>
    </Card>
  );
}

export function ActiveNowCard({ count }: { count: number; lastMonth: any }) {
  return (
    <Card x-chunk="dashboard-01-chunk-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Now</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+573</div>
        <p className="text-xs text-muted-foreground">+201 since last hour</p>
      </CardContent>
    </Card>
  );
}

export function RecentCompleted({ data }: { data: any }) {
  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Recent Completes</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {data.map((item: any) => (
          <div key={item.userId} className="flex items-center gap-4">
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {item.firstName + " " + item.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{item.email}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function CompletesCard({
  count,
  thisMonth,
  lastMonth,
}: {
  count: any;
  thisMonth: any;
  lastMonth: any;
}) {
  const percentage =
    ((thisMonth + 1 - (lastMonth + 1)) / (lastMonth + 1)) * 100;
  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Completes</CardTitle>
        <SquareCheck className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+{count}</div>
        {/* <p className="text-xs text-muted-foreground">
          +{percentage} from last month
        </p> */}
      </CardContent>
    </Card>
  );
}

export function TopCoursesCard({ data }: { data: any }) {
  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Top Courses</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {data.map((item: any) => (
          <div key={item.userId} className="flex items-center gap-4">
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {item.courseTitle}
              </p>
              <p className="text-sm text-muted-foreground">
                Create: {item.courseCreatedAt}
              </p>
            </div>
            <div className="ml-auto font-medium">
              {item.enrolmentCount} enrolments
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
