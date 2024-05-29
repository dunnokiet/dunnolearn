import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Course() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no courses
          </h3>
          <p className="text-sm text-muted-foreground">
            You can start teaching as soon as you add a course.
          </p>
          <Button asChild className="mt-4">
            <Link href="courses/create/">Add Course</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
