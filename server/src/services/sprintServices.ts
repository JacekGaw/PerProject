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
    console.error("Error getting sprint by project id from db:", err);
    throw err;
  }
};

export const getSprintBySprintId = async (
    sprintId: number
  ): Promise<typeof sprints.$inferSelect> => {
    try {
      const sprintsArr = await db
        .select()
        .from(sprints)
        .where(eq(sprints.id, sprintId));
      return sprintsArr[0];
    } catch (err) {
      console.error("Error getting sprint by project id from db:", err);
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
    console.error("Error adding new sprint to db ", err);
    throw err;
  }
};

export const updateSprintInDB = async (
    sprintId: number,
    sprintData: Partial<typeof sprints.$inferSelect>
  ): Promise<typeof sprints.$inferSelect> => {
    try {
      const updatedSprint = await db.update(sprints).set(sprintData).where(eq(sprints.id, sprintId)).returning();
      return updatedSprint[0];
    } catch (err) {
      console.error("Error updating sprint in db ", err);
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
    console.error("Error assigning tasks to sprint in the database:", err);
    throw err;
  }
};

export const deleteSprintFromDB = async (
    sprintId: number
  ) => {
    try {
      const deletedSprint = await db.delete(sprints).where(eq(sprints.id, sprintId)).returning();
      return deletedSprint;
    } catch (err) {
      console.error("Error deleting sprint from the database:", err);
      throw err;
    }
  };

export const endSprintInDB = async (sprintId: number, tasksAction: "done" | "backlog") => {
    try {
        let updatedTasks = []
        // if(tasksAction == "done") {
        //     updatedTasks = await db
        //     .update(tasks)
        //     .set({ status: "Done" })
        //     .where(eq(tasks.sprintId, sprintId)).returning();
        // }
        // else {
        //     updatedTasks = await db
        //     .update(tasks)
        //     .set({ sprintId: null })
        //     .where(eq(tasks.sprintId, sprintId)).returning();
        // }
        const updatedSprint = await db.update(sprints).set({status: "Active"}).where(eq(sprints.id, sprintId)).returning();

        return updatedSprint
      } catch (err) {
        console.error("Error assigning tasks to sprint in the database:", err);
        throw err;
      }
}
