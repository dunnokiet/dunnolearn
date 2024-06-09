import { db } from "@/db";
import { lessons, users_progress, courses, modules } from "@/db/schema";
import { and, eq, count, inArray } from "drizzle-orm";

export async function getProgress(
    userId: string,
    courseId: string,
): Promise<number> {
    try {
        const publishedLessons = await db.query.modules.findMany({
            where: and(eq(modules.courseId, courseId), eq(modules.isPublished, true)),
            with: {
                lessons: {
                    where: eq(lessons.isPublished, true),
                    columns: {
                        id: true
                    },
                }
            }
        })

        const publishedLessonsIds = publishedLessons.flatMap(item => item.lessons.map(lesson => lesson.id));


        const validCompletedLessons = await db.select({ count: count() }).from(users_progress).where(
            and(eq(users_progress.userId, userId), inArray(users_progress.lessonId, publishedLessonsIds), eq(users_progress.isCompleted, true))
        );

        const progressPercentage = (validCompletedLessons[0].count / publishedLessonsIds.length) * 100;

        return progressPercentage;
    } catch (error) {
        console.log("[GET_PROGRESSS", error)
        return 0;
    }
}