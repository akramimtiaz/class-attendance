CREATE TYPE "public"."day_of_week" AS ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');--> statement-breakpoint
ALTER TABLE "class_sessions" ALTER COLUMN "marked_by_user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "class_sessions" ALTER COLUMN "marked_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "class_sessions" ALTER COLUMN "marked_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ALTER COLUMN "day_of_week" SET DATA TYPE "public"."day_of_week" USING "day_of_week"::"public"."day_of_week";