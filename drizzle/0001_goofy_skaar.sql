CREATE TABLE "diagrams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text DEFAULT auth.user_id() NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "diagrams" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "diagrams" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "diagrams"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "diagrams" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "diagrams"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "diagrams" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "diagrams"."user_id")) WITH CHECK ((select auth.user_id() = "diagrams"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "diagrams" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "diagrams"."user_id"));