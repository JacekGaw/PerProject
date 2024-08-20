import { eq } from "drizzle-orm";
import db from "../database/db.js";
import { projects } from "../database/schemas.js";

interface ProjectUpdateData {
  name?: string;
  alias?: string;
  status?: "Active" | "On Hold" | "Completed" | "Archive" | "Maintaining";
  description?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: Date;
  authorId?: number;
  projectManager?: number;
  companyId?: number;
}

export const getProjectsFromDB = async (projectId?: number): Promise<{}> => {
  try {
    let projectsList = {};
    if (projectId) {
      projectsList = await db.query.projects.findMany({
        where: eq(projects.id, projectId),
      });
    } else {
      projectsList = await db.query.projects.findMany();
    }
    return projectsList;
  } catch (err) {
    console.error("Error getting projects from the database:", err);
    throw err;
  }
};

export const createNewProjectInDB = async (
  name: string,
  alias: string,
  status: "Active" | "On Hold" | "Completed" | "Archive" | "Maintaining",
  authorId: number,
  projectManager: number,
  companyId: number
): Promise<{}> => {
  try {
    const params = {
      name: name,
      alias: alias,
      status: status,
      authorId: authorId,
      projectManager: projectManager,
      companyId: companyId,
    };
    const newProject = await db.insert(projects).values(params).returning();
    return newProject;
  } catch (err) {
    console.error("Error getting projects from the database:", err);
    throw err;
  }
};

export const deleteProjectFromDb = async (projectId: number): Promise<{}> => {
  try {
    const deletedProject = await db
      .delete(projects)
      .where(eq(projects.id, projectId))
      .returning();
    return deletedProject;
  } catch (err) {
    console.error("Error deleting project to the database:", err);
    throw err;
  }
};

export const updateProjectInDB = async (
  data: ProjectUpdateData,
  userId: number
): Promise<{}> => {
  try {
    const newProjectData = { ...data };
    const updatedUser = await db
      .update(projects)
      .set(newProjectData)
      .where(eq(projects.id, userId))
      .returning();
    return updatedUser;
  } catch (err) {
    console.error("Error updating project to the database:", err);
    throw err;
  }
};
