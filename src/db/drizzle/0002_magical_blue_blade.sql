CREATE TABLE IF NOT EXISTS "lessons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assetId" text,
	"playbackId" text,
	"moduleId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text,
	"description" text,
	"videoURL" text,
	"position" integer,
	"courseId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_lesson" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text,
	"lessonId" uuid,
	"isCompleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "users_lesson_userId_unique" UNIQUE("userId"),
	CONSTRAINT "users_lesson_lessonId_unique" UNIQUE("lessonId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lessons" ADD CONSTRAINT "lessons_moduleId_modules_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "modules" ADD CONSTRAINT "modules_courseId_courses_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_lesson" ADD CONSTRAINT "users_lesson_lessonId_lessons_id_fk" FOREIGN KEY ("lessonId") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
