import { db } from "@/db";
import { courses } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const supabase = createClient();

        const { data: { user }, } = await supabase.auth.getUser();

        if (!user)
            return new NextResponse("Unthorized", { status: 401 })

        const { title } = await req.json();
        const userId = user.id

        const newCourse = await db.insert(courses).values({ title, userId }).returning();

        return NextResponse.json(newCourse[0]);
    } catch (error) {
        console.log("[COURSE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}