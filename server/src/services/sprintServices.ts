import { eq, and, inArray } from "drizzle-orm";
import db from "../database/db.js";
import { sprints, tasks } from "../database/schemas.js";

export interface NewSprintType {
  name: string;
  target: string;
  dateFrom: string | null;
  dateTo: string | null;
  projectId: number;
}

export const getSprintsByProjectId = async (
  projectId: number
): Promise<(typeof sprints.$inferSelect)[]> => {
  try {
    const sprintsArr = await db
      .select()
      .from(sprints)
      .where(
        and(
          eq(sprints.projectId, projectId),
          inArray(sprints.status, ["Planning", "Active"])
        )
      );
    return sprintsArr;
  } catch (err) {
    console.error("Error getting company by alias from the database:", err);
    throw err;
  }
};

export const addNewSprintToDB = async (
  sprintData: NewSprintType
): Promise<typeof sprints.$inferSelect> => {
  try {
    const newSprint = await db.insert(sprints).values(sprintData).returning();
    return newSprint[0];
  } catch (err) {
    console.error("Error getting company by alias from the database:", err);
    throw err;
  }
};

export const assignTasksToSprint = async (
  sprintId: number,
  tasksToAssign: number[]
) => {
  try {
    const updatedTasks = await db
      .update(tasks)
      .set({ sprintId })
      .where(inArray(tasks.id, tasksToAssign)).returning();

    return updatedTasks;
  } catch (err) {
    console.error("Error getting company by alias from the database:", err);
    throw err;
  }
};
