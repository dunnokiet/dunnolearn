import { db } from "@/db";
import { redirect, useSearchParams } from "next/navigation";
import { eq, asc, desc, and } from "drizzle-orm";
import {
  courses,
  categories,
  attachments,
  modules,
  lessons,
} from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { EditForm } from "@/components/courses/modules/edit-form";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import VideoForm from "@/components/courses/modules/lessons/video-form";
import { CustomizeModule } from "@/components/courses/modules/customize-module";
import { CustomizeLesson } from "@/components/courses/modules/lessons/customize-lesson";
import { Suspense } from "react";

export default async function ModuleId({
  params,
}: {
  params: { id: any; moduleId: any };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/");

  const myModule = await db.query.modules.findFirst({
    where: and(
      eq(modules.courseId, params.id),
      eq(modules.id, params.moduleId)
    ),
    with: {
      lessons: true,
    },
  });

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <Link href={`/courses/${params.id}`}>
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Modules</h1>
      </header>
      <main className="flex flex-1 flex-row gap-4 p-4 lg:gap-6 lg:p-6">
        <Suspense>
          <EditForm myModule={myModule} />
          <CustomizeModule myModule={myModule} />
          <CustomizeLesson myModule={myModule} />
        </Suspense>
      </main>
    </div>
  );
}
