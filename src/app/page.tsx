import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { eq, asc, desc, and } from "drizzle-orm";
import { courses, categories, attachments, modules, users } from "@/db/schema";
import { EditForm } from "@/components/courses/edit-form";
import { createClient } from "@/lib/supabase/server";
import { CustomizeCourse } from "@/components/courses/customize-course";
import { columns } from "@/components/courses/columns";
import { DataTable } from "@/components/courses/data-table";
import { CommandLineIcon, PlusIcon } from "@heroicons/react/24/outline";
import { unstable_noStore as noStore } from "next/cache";
import HomeCard from "@/components/home-card";

export default async function Home() {
  const data = await db.query.courses.findMany({
    orderBy: [desc(courses.createdAt)],
    limit: 3,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-blue-600 py-6 text-white">
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-4 md:px-6">
          <Link
            href="#"
            className="flex items-center gap-2 font-semibold"
            prefetch={false}
          >
            <CommandLineIcon className="h-8 w-8" />
            <span>Dunnolearn</span>
          </Link>
          <nav className="hidden space-x-4 md:flex">
            <Link
              href="/courses/search"
              className="hover:underline"
              prefetch={false}
            >
              Courses
            </Link>
            <Link
              href="https://www.facebook.com/profile.php?id=61557423315149"
              className="hover:underline"
              prefetch={false}
            >
              About
            </Link>
          </nav>
          <Button>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gray-800 py-20 text-white">
          <div className="container mx-auto max-w-5xl px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Self-study website
                </h1>
                <p className="mt-4 text-lg text-gray-400">
                  Unlock your full potential with our comprehensive online
                  courses. Learn from industry experts and build real-world
                  projects.
                </p>
                <div className="mt-6">
                  <Button className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
                    <Link href="/courses/search">Browse Courses</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <Image
                  src="/hero.PNG"
                  width="600"
                  height="400"
                  alt="Hero Image"
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20">
          <div className="container mx-auto max-w-5xl px-4 md:px-6">
            <h2 className="mb-8 text-3xl font-bold tracking-tight">
              Featured Free Courses
            </h2>
            <HomeCard courses={data} />
          </div>
        </section>
      </main>
      <aside className="bg-gray-100 py-12 dark:bg-blue-200">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <h2 className="mb-6 text-2xl font-bold">Course Categories</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="#"
              className="rounded-lg bg-white p-4 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
              prefetch={false}
            >
              <h3 className="text-lg font-semibold">Web Development</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Learn the latest web technologies and build modern web
                applications.
              </p>
            </Link>
            <Link
              href="#"
              className="rounded-lg bg-white p-4 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
              prefetch={false}
            >
              <h3 className="text-lg font-semibold">Data Science</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Dive into the world of data analysis and machine learning.
              </p>
            </Link>
            <Link
              href="#"
              className="rounded-lg bg-white p-4 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
              prefetch={false}
            >
              <h3 className="text-lg font-semibold">Mobile Development</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Build responsive and engaging mobile apps for iOS and Android.
              </p>
            </Link>
            <Link
              href="#"
              className="rounded-lg bg-white p-4 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
              prefetch={false}
            >
              <h3 className="text-lg font-semibold">DevOps</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Learn how to automate and streamline your software development
                workflows.
              </p>
            </Link>
            <Link
              href="#"
              className="rounded-lg bg-white p-4 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
              prefetch={false}
            >
              <h3 className="text-lg font-semibold">Cloud Computing</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Explore the world of cloud-based technologies and services.
              </p>
            </Link>
            <Link
              href="#"
              className="rounded-lg bg-white p-4 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
              prefetch={false}
            >
              <h3 className="text-lg font-semibold">Cybersecurity</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Learn how to protect your digital assets and stay secure online.
              </p>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
