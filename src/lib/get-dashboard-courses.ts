import { db } from "@/db";
import { SelectCategory, SelectCourse, categories, courses, enrolments, lessons, modules } from "@/db/schema";
import { and, arrayContains, desc, eq, ilike, like, or } from "drizzle-orm";
import { getProgress } from "./get-progress";
import { string } from "zod";
import { Underdog } from "next/font/google";

type CoursesWithProgressWithCategory = SelectCourse & {
    categories: SelectCategory | null;
    modules: { id: string | null }[];
    progress: number | null;
} | null;

type DashboardCourses = {
    completedCourses: CoursesWithProgressWithCategory[];
    coursesInProgress: CoursesWithProgressWithCategory[];
};

export const getDashboardCourses = async (
    userId: string
): Promise<DashboardCourses> => {
    try {
        const data = await db.query.enrolments.findMany({
            where: eq(enrolments.userId, userId),
            with: {
                courses: {
                    with: {
                        categories: true,
                        modules: {
                            where: eq(modules.isPublished, true),
                            with: {
                                lessons: {
                                    where: eq(lessons.isPublished, true),
                                }
                            }
                        },
                    },
                },
            },
        });

        const courses = data.map(
            (item) => item.courses
        ) as CoursesWithProgressWithCategory[];

        for (let course of courses) {
            const progress = await getProgress(userId, course?.id!);
            if (course)
                course['progress'] = progress;
        }

        const completedCourses = courses.filter(
            (course) => course?.progress === 100
        );
        const coursesInProgress = courses.filter(
            (course) => (course?.progress ?? 0) < 100
        );

        return {
            completedCourses,
            coursesInProgress,
        };
    } catch (error) {
        console.log('[GET_COURSES_PROGRESS]', error);
        return {
            completedCourses: [],
            coursesInProgress: [],
        };
    }
};