import { boolean, date, integer, pgEnum, pgTable, serial,text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum("role", ["Developer", "Tester", "Product Owner", "Project Manager", "Other"]);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', {length: 100}).notNull().unique(),
    password: varchar('password', {length: 200}).notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
    active: boolean('active').notNull().default(false),
    name: varchar('name', {length: 20}),
    surname: varchar('surname', {length: 30}),
    phone: integer('phone'),
    role: userRoleEnum('role').notNull()
});

export const projectStatusesEnum = pgEnum('projectStatuses', ["Active", "On Hold", "Completed", "Archive", "Maintaining"]);

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    name: varchar('name', {length: 50}).notNull(),
    alias: varchar('alias', {length: 4}).notNull().unique(),
    description: text('description'),
    status: projectStatusesEnum('status').notNull(),
    startDate: date('startDate'),
    endDate: date('endDate'),
    createdAt: timestamp('createdAt').defaultNow(),
    authorId: integer('authorId').references(() => users.id, { onDelete: "set null" }),  // Set to NULL on user deletion
    projectManager: integer('projectManager').references(() => users.id, { onDelete: 'set null' }),  // Set to NULL on user deletion
    companyId: integer('companyId').notNull().references(() => companies.id)
});

export const projectUsers = pgTable('projectUsers', {
    id: serial('id').primaryKey(),
    projectId: integer('projectId').notNull().references(() => projects.id),
    userId: integer('userId').notNull().references(() => users.id), 
});

export const companies = pgTable('companies', {
    id: serial('id').primaryKey(),
    name: varchar('name', {length: 50}).notNull(),
    description: text('description'),
    createdAt: timestamp('createdAt').defaultNow()
});

export const taskStatusesEnum = pgEnum("taskStatuses", ["To Do", "In Progress", "On Hold", "Done"]);

export const taskPriorityEnum = pgEnum('taskPriority', ["Low", "Medium", "High"]);

export const taskTypeEnum = pgEnum('taskType', ["Task", "Story", "Error"]);


export const tasks = pgTable('tasks', {
    id: serial('id').primaryKey(),
    taskText: text('taskText').notNull(),
    description: text('description'),
    type: taskTypeEnum('type').notNull().default("Task"),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt'),
    priority: taskPriorityEnum('priority').notNull().default("Low"),
    estimatedTime: integer('estimatedTime').default(0),
    status: taskStatusesEnum("status").notNull().default("To Do"),
    assignedTo: integer('assignedTo').references(() => users.id, { onDelete: 'set null' }),  // Set to NULL on user deletion
    projectId: integer('projectId').references(() => projects.id, { onDelete: 'cascade' }) 
});

export const subTasks = pgTable('subTasks', {
    id: serial('id').primaryKey(),
    taskText: text('taskText').notNull(),
    description: text('description'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt'),
    priority: taskPriorityEnum('priority').notNull().default("Low"),
    estimatedTime: integer('estimatedTime').default(0),
    status: taskStatusesEnum("status").notNull().default("To Do"),
    assignedTo: integer('assignedTo').references(() => users.id),
    taskId: integer('taskId').references(() => tasks.id)
});

export const taskHistory = pgTable('taskHistory', {
    id: serial('id').primaryKey(),
    taskId: integer('taskId').notNull().references(() => tasks.id),
    userId: integer('userId').notNull().references(() => users.id),
    changeType: varchar('changeType', {length: 50}).notNull(), 
    oldValue: text('oldValue'),
    newValue: text('newValue'),
    createdAt: timestamp('createdAt').defaultNow()
  });