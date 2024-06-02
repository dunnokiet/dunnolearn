DO $$ BEGIN
 ALTER TABLE "courses" ADD CONSTRAINT "courses_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
