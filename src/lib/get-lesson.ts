import { attachments, courses, enrolments, modules, lessons, SelectAttachment, SelectLesson, users_progress } from "@/db/schema";
import { db } from "@/db";
import { and, arrayContains, desc, eq, ilike, like, or, gt, asc, lt } from "drizzle-orm";
import { string } from "zod";

interface GetLessonProps {
    userId: string;
    courseId: string;
    moduleId: string;
    lessonId: string;
}

export async function getLesson({
    userId,
    courseId,
    moduleId,
    lessonId,
}: GetLessonProps) {

    try {
        const enrolment = await db.query.enrolments.findFirst({
            where: and(eq(enrolments.userId, userId), eq(enrolments.courseId, courseId)),
        });

        const course = await db.query.courses.findFirst({
            where: and(eq(courses.isPublished, true), eq(courses.id, courseId)),
        });

        const myModule = await db.query.modules.findFirst({
            where: and(eq(modules.isPublished, true), eq(modules.id, moduleId)),
        });

        const lesson = await db.query.lessons.findFirst({
            where: and(eq(lessons.isPublished, true), eq(lessons.id, lessonId)),
        });

        if (!course || !myModule || !lesson)
            throw new Error("Not found!");

        let attachment: SelectAttachment[] = [];
        let nextLesson: SelectLesson | undefined = undefined;
        let preLesson: SelectLesson | undefined = undefined;

        if (enrolment) {
            attachment = await db.query.attachments.findMany({
                where: eq(attachments.courseId, courseId),
            })

            nextLesson = await db.query.lessons.findFirst({
                where: and(eq(lessons.moduleId, moduleId), eq(lessons.isPublished, true), gt(lessons.order, lesson?.order!)),
                orderBy: asc(lessons.order)
            })

            preLesson = await db.query.lessons.findFirst({
                where: and(eq(lessons.moduleId, moduleId), eq(lessons.isPublished, true), lt(lessons.order, lesson?.order!)),
                orderBy: asc(lessons.order)
            })
        }

        const user_progess = await db.query.users_progress.findFirst({
            where: and(eq(users_progress.userId, userId), eq(users_progress.lessonId, lessonId)),
        })

        return {
            lesson,
            myModule,
            course,
            videoURL: lesson.videoURL,
            attachments,
            nextLesson,
            preLesson,
            user_progess,
            enrolment,
        }

    } catch (error) {
        console.log("GET_COURSES");
        return {
            lesson: null,
            myModule: null,
            course: null,
            videoURL: null,
            attachments: [],
            nextLesson: null,
            preLesson: null,
            users_progress: null,
            enrolments: null,
        }
    }
}