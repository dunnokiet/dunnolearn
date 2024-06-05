import { db } from "@/db";
import { attachments, courses, modules, lessons } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, and, desc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: Request, { params }: { params: { id: any, moduleId: any, lessonId: any } }) {
    try {
        const supabase = createClient();

        const { data: { user }, } = await supabase.auth.getUser();

        if (!user)
            return new NextResponse("Unthorized", { status: 401 })

        const values = await req.json();

        const course = await db.query.courses.findFirst({
            where: and(eq(courses.id, params.id), eq(courses.userId, user.id)),
        });

        if (!course)
            return new NextResponse("Unthorized", { status: 401 })

        const lesson = await db.update(lessons).set({ ...values }).where(and(eq(lessons.moduleId, params.moduleId), eq(lessons.id, params.lessonId)));

        return NextResponse.json(lessons);
    } catch (error) {
        console.log("[COURSE_ID_MODULES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: any, moduleId: any, lessonId: any } }) {
    try {
        const supabase = createClient();

        const { data: { user }, } = await supabase.auth.getUser();

        if (!user)
            return new NextResponse("Unthorized", { status: 401 })

        const course = await db.query.courses.findFirst({
            where: and(eq(courses.id, params.id), eq(courses.userId, user.id)),
        });

        if (!course)
            return new NextResponse("Unthorized", { status: 401 })

        const lesson = await db.delete(lessons).where(and(eq(lessons.moduleId, params.moduleId), eq(lessons.id, params.lessonId)))

        return NextResponse.json(lesson);
    } catch (error) {
        console.log("[COURSE_ID_MODULE_LESSON]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}