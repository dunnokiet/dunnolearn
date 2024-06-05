import { db } from "@/db";
import { redirect } from "next/navigation";
import { eq, asc, desc, and } from "drizzle-orm";
import { courses, categories, attachments, modules, users } from "@/db/schema";
import { EditForm } from "@/components/courses/edit-form";
import { createClient } from "@/lib/supabase/server";
import { CustomizeCourse } from "@/components/courses/customize-course";
import { columns } from "@/components/courses/columns";
import { DataTable } from "@/components/courses/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import Categories from "@/components/search/categories";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Suspense, useState } from "react";
import SearchInput from "@/components/search/search-input";

export default async function SearchPage() {
  const data = await db.query.categories.findMany({
    orderBy: [desc(categories.name)],
  });

  return (
    <Suspense>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <SearchInput />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Categories items={data} />
        </main>
      </div>
    </Suspense>
  );
}
