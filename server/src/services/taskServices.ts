import { eq } from "drizzle-orm";
import db from "../database/db.js";
import { tasks, taskPriorityEnum, taskStatusesEnum, taskTypeEnum, subTasks} from "../database/schemas.js";

type Task = typeof tasks.$inferSelect;

export interface NewTaskType {
    taskText: string;
    description?: string;
    type?: "Task" | "Story" | "Error";  // Use string literals here
    priority?: "Low" | "Medium" | "High";  // Match your DB enums
    estimatedTime?: number;
    status?: "To Do" | "In Progress" | "On Hold" | "Done";  // Match DB enums
    assignedTo?: number | null;
    authorId: number;
    projectId: number;
}

export const getTaskFromDB = async (id: number): Promise<object> => {
    try {
        const taskToReturn = await db.select().from(tasks).where(eq(tasks.id, id));
        const subtasks = await db.select().from(subTasks).where(eq(subTasks.taskId, id));
        return {
            task: taskToReturn[0],
            subtasks: subtasks
        }
    } catch (err) {
        console.error("Error trying to add task to db", err);
      throw err;
    }
}

export const changeTaskInDB = async (
    taskId: number,
    changeTask: Partial<NewTaskType>
  ): Promise<typeof tasks.$inferSelect> => {
    const date = new Date();
    try {
      const changedTask = await db
        .update(tasks)
        .set({...changeTask, updatedAt: date })  // Now changeTask matches the DB types correctly
        .where(eq(tasks.id, taskId))
        .returning();  // Ensure you return the updated task
      return changedTask[0];  // Return the first result (usually only 1)
    } catch (err) {
      console.error("Error trying to update task in db", err);
      throw err;
    }
  };


  export const addNewTaskToDB = async (
    newTask: NewTaskType
  ): Promise<typeof tasks.$inferSelect> => {
    try {
        const newTaskAdded = await db.insert(tasks).values(newTask).returning();
        return newTaskAdded[0];
    } catch (err) {
        console.error("Error trying to add task to db", err);
      throw err;
    }
  }

  export const addNewSubtaskToDB = async (
    newTask: NewTaskType
  ): Promise<typeof subTasks.$inferSelect> => {
    try {
        const newSubtaskAdded = await db.insert(subTasks).values(newTask).returning();
        return newSubtaskAdded[0];
    } catch (err) {
        console.error("Error trying to add subtask to db", err);
      throw err;
    }
  }

export const deleteTaskFromDB = async (id: number): Promise<typeof tasks.$inferSelect> => {
    try {
        const deletedTask = await db.delete(tasks).where(eq(tasks.id, id)).returning();
        return deletedTask[0];
    } catch (err) {
        console.error("Error trying to add task to db", err);
      throw err;
    }
}