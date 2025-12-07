CREATE TYPE "public"."projectStatuses" AS ENUM('Active', 'On Hold', 'Completed', 'Archive', 'Maintaining');--> statement-breakpoint
CREATE TYPE "public"."sprintStatus" AS ENUM('Planning', 'Active', 'Completed');--> statement-breakpoint
CREATE TYPE "public"."taskPriority" AS ENUM('Low', 'Medium', 'High');--> statement-breakpoint
CREATE TYPE "public"."taskStatuses" AS ENUM('To Do', 'In Progress', 'On Hold', 'Done');--> statement-breakpoint
CREATE TYPE "public"."taskType" AS ENUM('Task', 'Story', 'Error');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('Developer', 'Tester', 'Product Owner', 'Project Manager', 'Other');--> statement-breakpoint
CREATE TABLE "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now(),
	"settings" json DEFAULT '{"AI":{"available":false,"model":"","api_key":""}}'::json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companyUsers" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"companyId" integer NOT NULL,
	"joinDate" timestamp DEFAULT now(),
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"alias" varchar(4) NOT NULL,
	"description" text,
	"status" "projectStatuses" DEFAULT 'Active' NOT NULL,
	"startDate" date,
	"endDate" date,
	"createdAt" timestamp DEFAULT now(),
	"authorId" integer,
	"projectManagerId" integer,
	"companyId" integer NOT NULL,
	CONSTRAINT "projects_alias_unique" UNIQUE("alias")
);
--> statement-breakpoint
CREATE TABLE "sprints" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"target" text,
	"dateFrom" date,
	"dateTo" date,
	"status" "sprintStatus" DEFAULT 'Planning' NOT NULL,
	"created" timestamp DEFAULT now(),
	"projectId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subTasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"taskText" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"priority" "taskPriority" DEFAULT 'Low' NOT NULL,
	"estimatedTime" integer DEFAULT 0,
	"status" "taskStatuses" DEFAULT 'To Do' NOT NULL,
	"assignedTo" integer,
	"authorId" integer,
	"taskId" integer
);
--> statement-breakpoint
CREATE TABLE "taskHistory" (
	"id" serial PRIMARY KEY NOT NULL,
	"taskId" integer NOT NULL,
	"userId" integer NOT NULL,
	"changeType" varchar(50) NOT NULL,
	"oldValue" text,
	"newValue" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"taskText" text NOT NULL,
	"description" text,
	"type" "taskType" DEFAULT 'Task' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"priority" "taskPriority" DEFAULT 'Low' NOT NULL,
	"estimatedTime" integer DEFAULT 0,
	"status" "taskStatuses" DEFAULT 'To Do' NOT NULL,
	"assignedTo" integer,
	"authorId" integer,
	"projectId" integer,
	"sprintId" integer
);
--> statement-breakpoint
CREATE TABLE "userFavourites" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"projectId" integer NOT NULL,
	"addedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(200) NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"active" boolean DEFAULT true NOT NULL,
	"name" varchar(20),
	"surname" varchar(30),
	"phone" varchar(20),
	"role" "role" NOT NULL,
	"admin" boolean DEFAULT true NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "companyUsers" ADD CONSTRAINT "companyUsers_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companyUsers" ADD CONSTRAINT "companyUsers_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_projectManagerId_users_id_fk" FOREIGN KEY ("projectManagerId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sprints" ADD CONSTRAINT "sprints_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subTasks" ADD CONSTRAINT "subTasks_assignedTo_users_id_fk" FOREIGN KEY ("assignedTo") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subTasks" ADD CONSTRAINT "subTasks_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subTasks" ADD CONSTRAINT "subTasks_taskId_tasks_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taskHistory" ADD CONSTRAINT "taskHistory_taskId_tasks_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taskHistory" ADD CONSTRAINT "taskHistory_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedTo_users_id_fk" FOREIGN KEY ("assignedTo") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_sprintId_sprints_id_fk" FOREIGN KEY ("sprintId") REFERENCES "public"."sprints"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userFavourites" ADD CONSTRAINT "userFavourites_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userFavourites" ADD CONSTRAINT "userFavourites_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;