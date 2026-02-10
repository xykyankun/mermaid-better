CREATE TABLE "templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text DEFAULT auth.user_id(),
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"category" varchar(50) NOT NULL,
	"description" text,
	"is_system" boolean DEFAULT false NOT NULL,
	"thumbnail" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "templates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "templates" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("templates"."is_system" OR (select auth.user_id() = "templates"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "templates" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "templates"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "templates" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "templates"."user_id")) WITH CHECK ((select auth.user_id() = "templates"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "templates" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "templates"."user_id"));