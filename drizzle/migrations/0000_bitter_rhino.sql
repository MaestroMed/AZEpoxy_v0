CREATE TYPE "public"."lead_event_type" AS ENUM('created', 'status_change', 'note_added', 'contacted');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('contact', 'devis', 'guide', 'abandoned', 'other');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'qualified', 'won', 'lost');--> statement-breakpoint
CREATE TABLE "lead_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"type" "lead_event_type" NOT NULL,
	"payload" jsonb,
	"actor" text DEFAULT 'system' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" "lead_source" DEFAULT 'contact' NOT NULL,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"company" text,
	"message" text,
	"project_type" text,
	"ral_code" text,
	"extra" jsonb,
	"ip_hash" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lead_events" ADD CONSTRAINT "lead_events_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lead_events_lead_id_idx" ON "lead_events" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "lead_events_created_at_idx" ON "lead_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_source_idx" ON "leads" USING btree ("source");--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");