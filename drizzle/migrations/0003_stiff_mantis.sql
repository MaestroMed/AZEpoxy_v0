-- text → integer : PostgreSQL exige une clause USING pour ce cast, et le
-- DEFAULT '0' (text) doit être déposé avant le changement de type puis
-- recréé en integer, sinon "default cannot be cast automatically".
ALTER TABLE "seo_qa_runs" ALTER COLUMN "duration_ms" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "seo_qa_runs" ALTER COLUMN "duration_ms" SET DATA TYPE integer USING "duration_ms"::integer;--> statement-breakpoint
ALTER TABLE "seo_qa_runs" ALTER COLUMN "duration_ms" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "seo_qa_runs" ALTER COLUMN "total_pages" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "seo_qa_runs" ALTER COLUMN "total_pages" SET DATA TYPE integer USING "total_pages"::integer;--> statement-breakpoint
ALTER TABLE "seo_qa_runs" ALTER COLUMN "total_pages" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "seo_qa_runs" ALTER COLUMN "ok_count" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "seo_qa_runs" ALTER COLUMN "ok_count" SET DATA TYPE integer USING "ok_count"::integer;--> statement-breakpoint
ALTER TABLE "seo_qa_runs" ALTER COLUMN "ok_count" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "seo_qa_runs" ALTER COLUMN "ko_count" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "seo_qa_runs" ALTER COLUMN "ko_count" SET DATA TYPE integer USING "ko_count"::integer;--> statement-breakpoint
ALTER TABLE "seo_qa_runs" ALTER COLUMN "ko_count" SET DEFAULT 0;
