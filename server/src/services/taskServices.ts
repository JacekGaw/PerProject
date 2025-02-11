import { eq, desc, and, ne } from "drizzle-orm";
import db from "../database/db.js";
import { tasks, subTasks, projects } from "../database/schemas.js";

type Task = typeof tasks.$inferSelect;

export interface NewTaskType {
  taskText: string;
  description?: string;
  type?: "Task" | "Story" | "Error"; // Use string literals here
  priority?: "Low" | "Medium" | "High"; // Match your DB enums
  estimatedTime?: number;
  status?: "To Do" | "In Progress" | "On Hold" | "Done"; // Match DB enums
  assignedTo?: number | null;
  authorId: number;
  projectId: number;
  sprintId?: number;
}

export interface NewSubtaskType {
  taskText: string;
  description?: string;
  type?: "Task" | "Error"; // Use string literals here
  priority?: "Low" | "Medium" | "High"; // Match your DB enums
  estimatedTime?: number;
  status?: "To Do" | "In Progress" | "On Hold" | "Done"; // Match DB enums
  assignedTo?: number | null;
  authorId: number;
  taskId: number;
}

export const getTaskFromDB = async (
  id: number
): Promise<{ task: Task; subtasks: (typeof subTasks.$inferSelect)[] }> => {
  try {
    const taskToReturn = await db.select().from(tasks).where(eq(tasks.id, id));
    const subtasks = await db
      .select()
      .from(subTasks)
      .where(eq(subTasks.taskId, id))
      .orderBy(subTasks.createdAt);
    return {
      task: taskToReturn[0],
      subtasks: subtasks,
    };
  } catch (err) {
    console.error("Error trying to get subtask from db", err);
    throw err;
  }
};

export const getSubtaskFromDB = async (id: number): Promise<object> => {
  try {
    const subtask = await db.select().from(subTasks).where(eq(subTasks.id, id));
    return subtask;
  } catch (err) {
    console.error("Error trying to get subtask from db", err);
    throw err;
  }
};

export const getTasksFromDB = async (
  userId: number,
  withSubtasks: boolean
): Promise<object> => {
  try {
    if (!withSubtasks) {
      const tasksToReturn = await db.query.tasks.findMany({
        where: eq(tasks.assignedTo, userId),
        orderBy: (tasks, { asc }) => [asc(tasks.createdAt)],
        with: {
          project: {
            columns: {
              id: true,
              name: true,
              alias: true,
            },
          },
        },
      });
      return tasksToReturn;
    } else {
      const tasksToReturn = await db.query.tasks.findMany({
        where: eq(tasks.assignedTo, userId),
        orderBy: (tasks, { asc }) => [asc(tasks.createdAt)],
        with: {
          subTasks: {
            where: eq(subTasks.assignedTo, userId),
            orderBy: (subTasks, { asc }) => [asc(subTasks.createdAt)],
          },
          project: {
            columns: {
              id: true,
              name: true,
              alias: true,
            },
          },
        },
      });
      return tasksToReturn;
    }
  } catch (err) {
    console.error("Error trying to add task to db", err);
    throw err;
  }
};

export const getDashboardTasksFromDB = async (
  companyId: number,
  userId: number
): Promise<object[]> => {
  try {
    const userTasks = await db
      .selectDistinct({
        id: tasks.id,
        taskText: tasks.taskText,
        description: tasks.description,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        priority: tasks.priority,
        estimatedTime: tasks.estimatedTime,
        status: tasks.status,
        projectAlias: projects.alias,
      })
      .from(tasks)
      .leftJoin(projects, eq(projects.id, tasks.projectId))
      .where(and(eq(tasks.assignedTo, userId), ne(tasks.status, "Done")))
      .orderBy(desc(tasks.createdAt));
    console.log(userTasks);
    return userTasks;
  } catch (err) {
    console.error("Error getting latest tasks from the database:", err);
    throw err;
  }
};

export const changeTaskInDB = async (
  taskId: number,
  changeTask: Partial<NewTaskType>,
  type: "task" | "subtask"
): Promise<typeof tasks.$inferSelect | typeof subTasks.$inferSelect> => {
  try {
    let changedTask;
    type == "task"
      ? (changedTask = await db
          .update(tasks)
          .set({ ...changeTask, updatedAt: new Date() })
          .where(eq(tasks.id, taskId))
          .returning())
      : (changedTask = await db
          .update(subTasks)
          .set({ ...changeTask, updatedAt: new Date() })
          .where(eq(subTasks.id, taskId))
          .returning());
    return changedTask[0];
  } catch (err) {
    console.error("Error trying to update task in db", err);
    throw err;
  }
};

export const addNewTaskToDB = async (
  newTask: NewTaskType | NewSubtaskType,
  table: "tasks" | "subTasks"
): Promise<typeof tasks.$inferSelect | typeof subTasks.$inferSelect> => {
  try {
    let newTaskAdded;
    table == "tasks"
      ? (newTaskAdded = await db.insert(tasks).values(newTask).returning())
      : (newTaskAdded = await db.insert(subTasks).values(newTask).returning());
    return newTaskAdded[0];
  } catch (err) {
    console.error("Error trying to add task or subtask to db", err);
    throw err;
  }
};

export const addNewSubtaskToDB = async (
  newTask: NewTaskType
): Promise<typeof subTasks.$inferSelect> => {
  try {
    const newSubtaskAdded = await db
      .insert(subTasks)
      .values(newTask)
      .returning();
    return newSubtaskAdded[0];
  } catch (err) {
    console.error("Error trying to add subtask to db", err);
    throw err;
  }
};

export const addSubtasksBatchToDB = async (
  newTasks: NewTaskType[]
): Promise<(typeof subTasks.$inferSelect)[]> => {
  try {
    const newSubtasksAdded = await db
      .insert(subTasks)
      .values(newTasks)
      .returning();
    return newSubtasksAdded;
  } catch (err) {
    console.error("Error trying to add subtasks to db", err);
    throw err;
  }
};

export const deleteTaskFromDB = async (
  id: number,
  table: "tasks" | "subTasks"
): Promise<typeof tasks.$inferSelect | typeof subTasks.$inferSelect> => {
  try {
    let deletedTask;
    table == "tasks"
      ? (deletedTask = await db
          .delete(tasks)
          .where(eq(tasks.id, id))
          .returning())
      : (deletedTask = await db
          .delete(subTasks)
          .where(eq(subTasks.id, id))
          .returning());
    return deletedTask[0];
  } catch (err) {
    console.error("Error trying to delete task from db", err);
    throw err;
  }
};
