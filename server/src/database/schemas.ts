import { boolean, date, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
export const userRoleEnum = pgEnum("role", ["Developer", "Tester", "Product Owner", "Project Manager", "Other"]);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    password: varchar('password', { length: 200 }).notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
    active: boolean('active').notNull().default(false),
    name: varchar('name', { length: 20 }),
    surname: varchar('surname', { length: 30 }),
    phone: varchar('phone', { length: 20 }), // Changed to varchar
    role: userRoleEnum('role').notNull(),
    admin: boolean('admin').notNull().default(false)
});

export const projectStatusesEnum = pgEnum('projectStatuses', ["Active", "On Hold", "Completed", "Archive", "Maintaining"]);

export const companies = pgTable('companies', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }).notNull(),
    description: text('description'),
    createdAt: timestamp('createdAt').defaultNow()
});

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }).notNull(),
    alias: varchar('alias', { length: 4 }).notNull().unique(),
    description: text('description'),
    status: projectStatusesEnum('status').notNull().default("Active"),
    startDate: date('startDate'),
    endDate: date('endDate'),
    createdAt: timestamp('createdAt').defaultNow(),
    authorId: integer('authorId').references(() => users.id, { onDelete: "set null" }),
    projectManagerId: integer('projectManagerId').references(() => users.id, { onDelete: 'set null' }),
    companyId: integer('companyId').notNull().references(() => companies.id, { onDelete: 'cascade' })
});

export const companyUsers = pgTable('companyUsers', {
    id: serial('id').primaryKey(),
    userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    companyId: integer('companyId').notNull().references(() => companies.id, { onDelete: 'cascade' }),
    joinDate: timestamp('joinDate').defaultNow(),
    active: boolean('active').default(true),
});

export const projectUsers = pgTable('projectUsers', {
    id: serial('id').primaryKey(),
    projectId: integer('projectId').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    role: userRoleEnum('role').notNull(),
    joinDate: timestamp('joinDate').defaultNow(),
    active: boolean('active').default(true),
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
    updatedAt: timestamp('updatedAt').defaultNow(),
    priority: taskPriorityEnum('priority').notNull().default("Low"),
    estimatedTime: integer('estimatedTime').default(0),
    status: taskStatusesEnum("status").notNull().default("To Do"),
    assignedTo: integer('assignedTo').references(() => users.id, { onDelete: 'set null' }),
    authorId: integer('authorId').references(() => users.id, {onDelete: 'set null'}),
    projectId: integer('projectId').references(() => projects.id, { onDelete: 'cascade' })
});

export const subTasks = pgTable('subTasks', {
    id: serial('id').primaryKey(),
    taskText: text('taskText').notNull(),
    description: text('description'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
    priority: taskPriorityEnum('priority').notNull().default("Low"),
    estimatedTime: integer('estimatedTime').default(0),
    status: taskStatusesEnum("status").notNull().default("To Do"),
    assignedTo: integer('assignedTo').references(() => users.id, { onDelete: 'set null' }),
    authorId: integer('authorId').references(() => users.id, {onDelete: 'set null'}),
    taskId: integer('taskId').references(() => tasks.id, { onDelete: 'cascade' })
});

export const taskHistory = pgTable('taskHistory', {
    id: serial('id').primaryKey(),
    taskId: integer('taskId').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
    userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    changeType: varchar('changeType', { length: 50 }).notNull(),
    oldValue: text('oldValue'),
    newValue: text('newValue'),
    createdAt: timestamp('createdAt').defaultNow()
});

export const userFavourites = pgTable('userFavourites', {
    id: serial('id').primaryKey(),
    userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    projectId: integer('projectId').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    addedAt: timestamp('addedAt').defaultNow(),
});

export const tasksRelations = relations(tasks, ({ many, one }) => ({
    subTasks: many(subTasks),
    project: one(projects, {
        fields: [tasks.projectId],
        references: [projects.id],
    }),
  }));
  
  export const subTasksRelations = relations(subTasks, ({ one }) => ({
    task: one(tasks, {
      fields: [subTasks.taskId],
      references: [tasks.id],
    }),
  }));