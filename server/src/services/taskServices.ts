import { eq } from "drizzle-orm";
import db from "../database/db.js";
import { tasks, taskPriorityEnum, taskStatusesEnum, taskTypeEnum} from "../database/schemas.js";

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

export const changeTaskInDB = async (
    taskId: number,
    changeTask: Partial<NewTaskType>
  ): Promise<typeof tasks.$inferSelect> => {
    try {
      const changedTask = await db
        .update(tasks)
        .set(changeTask)  // Now changeTask matches the DB types correctly
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