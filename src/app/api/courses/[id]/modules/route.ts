import { db } from "@/db";
import { attachments, courses, modules } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, and, desc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: { id: any } }) {
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

        const lastModule = await db.query.modules.findFirst({
            where: eq(modules.courseId, params.id),
            orderBy: [desc(modules.order)],
        });

        const newOrder = lastModule ? lastModule?.order! + 1 : 1;

        const newModule = await db.insert(modules).values({
            title,
            courseId: params.id,
            order: newOrder
        })

        return NextResponse.json(newModule);
    } catch (error) {
        console.log("[COURSE_MODULES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}