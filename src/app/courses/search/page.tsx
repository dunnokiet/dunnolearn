import { db } from "@/db";
import { redirect } from "next/navigation";
import { eq, asc, desc, and } from "drizzle-orm";
import { courses, categories, attachments, modules, users } from "@/db/schema";

import { createClient } from "@/lib/supabase/server";

import Categories from "@/components/search/categories";

import { Suspense, useState } from "react";
import SearchInput from "@/components/search/search-input";
import { getCourses } from "@/lib/get-courses";
import { CourseList } from "@/components/search/course-list";

interface SearchPage {
  searchParams: {
    title: string | null;
    categoryId: string | null;
  };
}

export default async function SearchPage({ searchParams }: SearchPage) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/");

  const data = await db.query.categories.findMany({
    orderBy: [desc(categories.name)],
  });

  const courses = await getCourses({
    userId: user.id,
    ...searchParams,
  });

  return (
    <Suspense>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <SearchInput />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Categories items={data} />
          <CourseList items={courses} />
        </main>
      </div>
    </Suspense>
  );
}
