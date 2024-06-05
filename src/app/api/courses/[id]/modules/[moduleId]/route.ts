import { db } from "@/db";
import { attachments, courses, modules } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, and, desc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: Request, { params }: { params: { id: any, moduleId: any } }) {
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

        const myModule = await db.update(modules).set({ ...values }).where(and(eq(modules.courseId, params.id), eq(modules.id, params.moduleId)));

        return NextResponse.json(myModule);
    } catch (error) {
        console.log("[COURSE_ID_MODULES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: any, moduleId: any } }) {
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

        const myModule = await db.delete(modules).where(and(eq(modules.courseId, params.id), eq(modules.id, params.moduleId)))

        return NextResponse.json(myModule);
    } catch (error) {
        console.log("[COURSE_ID_MODULE_LESSON]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}