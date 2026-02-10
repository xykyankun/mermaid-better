ALTER TABLE "diagrams" ADD COLUMN "is_public" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "diagrams" ADD COLUMN "share_token" varchar(64);--> statement-breakpoint
ALTER TABLE "diagrams" ADD COLUMN "view_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-select" ON "diagrams" AS PERMISSIVE FOR SELECT TO "anonymous";--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-insert" ON "diagrams" AS PERMISSIVE FOR INSERT TO "anonymous" WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-update" ON "diagrams" AS PERMISSIVE FOR UPDATE TO "anonymous" USING (false) WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-delete" ON "diagrams" AS PERMISSIVE FOR DELETE TO "anonymous" USING (false);--> statement-breakpoint
ALTER POLICY "crud-authenticated-policy-select" ON "diagrams" TO authenticated USING ((select auth.user_id() = "diagrams"."user_id") OR "diagrams"."is_public");