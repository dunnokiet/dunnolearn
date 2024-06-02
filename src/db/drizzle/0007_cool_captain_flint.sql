ALTER TABLE "courses" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "courses" DROP CONSTRAINT "courses_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "userId" DROP NOT NULL;