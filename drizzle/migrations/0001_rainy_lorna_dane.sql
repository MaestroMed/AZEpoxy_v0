CREATE TABLE "seo_qa_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ran_at" timestamp with time zone DEFAULT now() NOT NULL,
	"duration_ms" text DEFAULT '0' NOT NULL,
	"total_pages" text DEFAULT '0' NOT NULL,
	"ok_count" text DEFAULT '0' NOT NULL,
	"ko_count" text DEFAULT '0' NOT NULL,
	"pages" jsonb NOT NULL,
	"trigger" text DEFAULT 'cron' NOT NULL
);
--> statement-breakpoint
CREATE INDEX "seo_qa_runs_ran_at_idx" ON "seo_qa_runs" USING btree ("ran_at");