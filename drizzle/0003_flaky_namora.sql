CREATE POLICY "crud-anonymous-policy-select" ON "templates" AS PERMISSIVE FOR SELECT TO "anonymous";--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-insert" ON "templates" AS PERMISSIVE FOR INSERT TO "anonymous" WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-update" ON "templates" AS PERMISSIVE FOR UPDATE TO "anonymous" USING (false) WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-delete" ON "templates" AS PERMISSIVE FOR DELETE TO "anonymous" USING (false);