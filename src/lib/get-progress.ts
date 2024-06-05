import { db } from "@/db";
import { lessons, users_process } from "@/db/schema";
import { and, eq, count, inArray } from "drizzle-orm";

export default async function getProgress({
    userId,
    moduleId
}: { userId: string, moduleId: string }): Promise<number> {
    try {
        const publishedLessons = await db.query.lessons.findMany({
            where: eq(lessons.moduleId, moduleId),
            columns: {
                id: true,
            }
        })

        const publishedLessonsIds = publishedLessons.map((lesson) => lesson.id);

        const validCompletedLessons = await db.select({ count: count() }).from(users_process).where(
            and(eq(users_process.userId, userId), inArray(lessons.id, publishedLessonsIds), eq(users_process.isCompleted, true))
        );

        const progressPercentage = (validCompletedLessons[0].count / publishedLessonsIds.length) * 100;

        return progressPercentage;
    } catch (error) {
        console.log("[GET_PROGRESSS", error)
        return 0;
    }
}