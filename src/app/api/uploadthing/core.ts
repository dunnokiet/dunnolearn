import { createClient } from "@/lib/supabase/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = async () => {
    const supabase = createClient();

    const { data: { user }, } = await supabase.auth.getUser();

    if (!user)
        throw new Error("Unauthorized");

    return { user }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } }).middleware(() => auth()).onUploadComplete(() => { }),
    courseAttachment: f(["text", "image", "video", "audio", "pdf"]).middleware(() => auth()).onUploadComplete(() => { }),
    courseChapter: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } }).middleware(() => auth()).onUploadComplete(() => { }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;