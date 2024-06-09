import { db } from "@/db";
import { attachments, courses, modules, lessons } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, and, desc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: { id: any, moduleId: any } }) {
    try {
        const supabase = createClient();

        const { data: { user }, } = await supabase.auth.getUser();

        if (!user)
            return new NextResponse("Unthorized", { status: 401 })

        const { title } = await req.json();

        const course = await db.query.courses.findFirst({
            where: and(eq(courses.id, params.id), eq(courses.userId, user.id)),
        });

        if (!course)
            return new NextResponse("Unthorized", { status: 401 })

        const lastLesson = await db.query.lessons.findFirst({
            where: eq(lessons.moduleId, params.moduleId),
            orderBy: [desc(lessons.order)],
        });


        const newOrder = lastLesson ? lastLesson?.order! + 1 : 1;

        const newLesson = await db.insert(lessons).values({
            title,
            moduleId: params.moduleId,
            order: newOrder
        })

        return NextResponse.json(newLesson);
    } catch (error) {
        console.log("[COURSE_MODULES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}