import { db } from "@/db";
import { SelectCategory, SelectCourse, categories, courses, enrolments, modules } from "@/db/schema";
import { and, arrayContains, desc, eq, ilike, like, or } from "drizzle-orm";
import { getProgress } from "./get-progress";
import { string } from "zod";
import { Underdog } from "next/font/google";

type CoursesWithProgressWithCategory = SelectCourse & {
    categories: SelectCategory | null;
    modules: { id: string | null }[];
    progress: number | null;
}

type GetCourses = {
    userId: string;
    title?: any;
    categoryId?: any;
}

export async function getCourses({
    userId,
    title,
    categoryId,
}: GetCourses) {
    try {
        const data = await db.query.courses.findMany({
            where: and(eq(courses.isPublished, true), title ? ilike(courses.title, `%${title}%`) : undefined, categoryId ? eq(courses.categoryId, categoryId) : undefined),
            with: {
                categories: true,
                modules: {
                    where: eq(modules.isPublished, true),
                    columns: {
                        id: true,
                    }
                },
                enrolments: {
                    where: eq(enrolments.userId, userId),
                }
            },
            orderBy: desc(courses.createdAt)
        })

        const coursesWithProgress: CoursesWithProgressWithCategory[] = await Promise.all(
            data.map(async course => {
                if (course.enrolments.length === 0) {
                    return {
                        ...course,
                        progress: null,
                    }
                }

                const progressPercentage = await getProgress(userId, course.id);

                return {
                    ...course,
                    progress: progressPercentage,
                }
            })
        )

        return coursesWithProgress;
    } catch (error) {
        console.log("GET_COURSES");
        return [];
    }
}