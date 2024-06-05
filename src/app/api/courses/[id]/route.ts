import { db } from "@/db";
import { courses } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: Request, { params }: { params: { id: any } }) {
    try {
        const supabase = createClient();

        const { data: { user }, } = await supabase.auth.getUser();

        if (!user)
            return new NextResponse("Unthorized", { status: 401 })

        const values = await req.json();

        const course = await db.update(courses).set({ ...values }).where(eq(courses.id, params.id)).returning();

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: any } }) {
    try {
        const supabase = createClient();

        const { data: { user }, } = await supabase.auth.getUser();

        if (!user)
            return new NextResponse("Unthorized", { status: 401 })

        const course = await db.query.courses.findFirst({
            where: eq(courses.id, params.id)
        });

        if (!course)
            return new NextResponse("Unthorized", { status: 401 })

        const lesson = await db.delete(courses).where(eq(courses.id, params.id))

        return NextResponse.json(lesson);
    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}