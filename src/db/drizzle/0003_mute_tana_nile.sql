ALTER TABLE "lessons" RENAME TO "videos";--> statement-breakpoint
ALTER TABLE "users_lesson" RENAME COLUMN "lessonId" TO "videoId";--> statement-breakpoint
ALTER TABLE "users_lesson" DROP CONSTRAINT "users_lesson_lessonId_lessons_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_lesson" ADD CONSTRAINT "users_lesson_videoId_videos_id_fk" FOREIGN KEY ("videoId") REFERENCES "public"."videos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
