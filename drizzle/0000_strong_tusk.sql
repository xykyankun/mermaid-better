CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text DEFAULT auth.user_id() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "todos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "todos" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "todos"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "todos" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "todos"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "todos" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "todos"."user_id")) WITH CHECK ((select auth.user_id() = "todos"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "todos" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "todos"."user_id"));