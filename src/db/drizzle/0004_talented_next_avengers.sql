ALTER TABLE "modules" DROP CONSTRAINT "modules_courseId_courses_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "modules" ADD CONSTRAINT "modules_courseId_courses_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
