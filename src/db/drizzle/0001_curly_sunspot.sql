CREATE TABLE IF NOT EXISTS "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar
);
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "isPublished" boolean DEFAULT false;