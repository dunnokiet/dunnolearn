import { db } from "@/db";
import { users_progress } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, and, desc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function PUT(req: Request, { params }: { params: { id: any, moduleId: any, lessonId: any } }) {
    try {
        const supabase = createClient();

        const { data: { user }, } = await supabase.auth.getUser();

        if (!user)
            return new NextResponse("Unthorized", { status: 401 })

        const { isCompleted } = await req.json();

        const progress = await db.insert(users_progress).values({ userId: user.id, lessonId: params.lessonId, isCompleted }).onConflictDoUpdate({
            target: [users_progress.userId, users_progress.lessonId],
            set: { isCompleted },
        })

        return NextResponse.json(progress);
    } catch (error) {
        console.log("[PROGRESS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

