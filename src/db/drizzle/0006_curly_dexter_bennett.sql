DROP TABLE "accounts";--> statement-breakpoint
ALTER TABLE "courses" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "courses" ADD CONSTRAINT "courses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
