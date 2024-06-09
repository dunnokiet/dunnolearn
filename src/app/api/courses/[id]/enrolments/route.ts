import { db } from "@/db";
import { attachments, courses, enrolments } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: { id: any } }) {
    try {
        const supabase = createClient();

        const { data: { user }, } = await supabase.auth.getUser();

        if (!user)
            return new NextResponse("Unthorized", { status: 401 })

        const course = await db.query.courses.findFirst({
            where: and(eq(courses.id, params.id), eq(courses.isPublished, true)),
        });

        if (!course)
            return new NextResponse("Unthorized", { status: 401 })

        const enrolment = await db.insert(enrolments).values({ courseId: params.id, userId: user.id }).returning();

        if (!enrolment) {
            return new NextResponse("Already enrolled", { status: 400 });
        }

        return NextResponse.json(enrolment[0]);
    } catch (error) {
        console.log("[COURSE_ATTACHMENTS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}