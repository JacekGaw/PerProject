import { eq, and, or, exists, isNull } from "drizzle-orm";
import db from "../database/db.js";
import {
  projects,
  projectStatusesEnum,
  tasks,
  userFavourites,
  subTasks,
  sprints
} from "../database/schemas.js";

type Project = typeof projects.$inferSelect;
type Task = typeof tasks.$inferSelect;

interface ProjectUpdateData {
  name?: string;
  alias?: string;
  status?: "Active" | "On Hold" | "Completed" | "Archive" | "Maintaining";
  description?: string;
  startDate?: string;
  endDate?: string;
  authorId?: number;
  projectManager?: number;
  companyId?: number;
}

export interface CreateProjectBody {
  name: string;
  alias: string;
  description?: string;
  status?: (typeof projectStatusesEnum.enumValues)[number];
  startDate?: string; // Change this to string
  endDate?: string; // Change this to string
  authorId?: number;
  projectManagerId?: number;
  companyId: number;
}

export const getProjectsFromDB = async (
  companyId?: string | undefined
): Promise<{}> => {
  try {
    let projectsList = [];
    if (companyId) {
      projectsList = await db
        .select()
        .from(projects)
        .where(eq(projects.companyId, parseInt(companyId)))
        .orderBy(projects.createdAt);
    } else {
      projectsList = await db.query.projects.findMany();
    }
    return projectsList;
  } catch (err) {
    console.error("Error getting projects from the database:", err);
    throw err;
  }
};

export const getDashboardProjectsFromDB = async (
  companyId: number,
  userId: number
): Promise<Project[]> => {
  try {
    const projectsList = await db
      .selectDistinct()
      .from(projects)
      .where(
        and(
          eq(projects.companyId, companyId),
          or(
            eq(projects.projectManagerId, userId),
            exists(
              db
                .select()
                .from(tasks)
                .where(
                  and(
                    eq(tasks.projectId, projects.id),
                    eq(tasks.assignedTo, userId)
                  )
                )
            ),
            exists(
              db
                .select()
                .from(tasks)
                .innerJoin(subTasks, eq(subTasks.taskId, tasks.id))
                .where(
                  and(
                    eq(tasks.projectId, projects.id),
                    eq(subTasks.assignedTo, userId)
                  )
                )
            )
          )
        )
      )
      .orderBy(projects.createdAt)
      .limit(10);
    return projectsList;
  } catch (err) {
    console.log(err);
    console.error("Error getting projects from the database:", err);
    throw err;
  }
};

export const getProjectFromDB = async (projectId: number): Promise<{}> => {
  try {
    const project = await db.query.projects.findMany({
      where: eq(projects.id, projectId),
    });

    return project;
  } catch (err) {
    console.error("Error getting project from the database:", err);
    throw err;
  }
};

export const getProjectByAlias = async (
  projectAlias: string
): Promise<Project | null> => {
  try {
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.alias, projectAlias))
      .limit(1);
    return project[0] || null;
  } catch (err) {
    console.error("Error getting company by alias from the database:", err);
    throw err;
  }
};

export const getTasksFromProject = async (
  projectId: number
): Promise<Task[] | null> => {
  try {
    const projectTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(tasks.createdAt);
    return projectTasks;
  } catch (err) {
    console.error("Error getting tasks from project with provided id: ", err);
    throw err;
  }
};


  export const getTasksFromProjectAndSprints = async (
    projectId: number
  ): Promise<Task[] | null> => {
    try {
      const projectTasks = await db
        .select()
        .from(tasks)
        .leftJoin(sprints, eq(tasks.sprintId, sprints.id)) // Join with sprints to check status
        .where(
          and(
            eq(tasks.projectId, projectId),
            or(
              isNull(tasks.sprintId), // Include tasks with no sprint
              eq(sprints.status, 'Planning'), // Include tasks in Planning sprints
              eq(sprints.status, 'Active')    // Include tasks in Active sprints
            )
          )
        )
        .orderBy(tasks.createdAt);
        console.log(projectTasks.map((entry) => entry.tasks));
        return projectTasks.map((entry) => entry.tasks);
    } catch (err) {
      console.error("Error getting tasks from project with provided id: ", err);
      throw err;
    }
  };


export const createNewProjectInDB = async (
  params: CreateProjectBody
): Promise<typeof projects.$inferSelect> => {
  try {
    const [newProject] = await db.insert(projects).values(params).returning();
    return newProject;
  } catch (err) {
    console.error("Error inserting project into the database:", err);
    throw err;
  }
};

export const createBookmarkInDB = async (projectId: number, userId: number) => {
  try {
    const bookmark = await db
      .insert(userFavourites)
      .values({ projectId, userId })
      .returning();
    return bookmark;
  } catch (err) {
    console.error("Error creating new bookmark in db:", err);
    throw err;
  }
};

export const deleteBookmarkInDB = async (projectId: number, userId: number) => {
  try {
    const deletedBookmark = await db
      .delete(userFavourites)
      .where(
        and(
          eq(userFavourites.projectId, projectId),
          eq(userFavourites.userId, userId)
        )
      )
      .returning();
    return deletedBookmark;
  } catch (err) {
    console.error("Error deleting bookmark from db:", err);
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

export const checkProjectExists = async (alias: string): Promise<boolean> => {
  try {
    const existingProject = await db
      .select()
      .from(projects)
      .where(eq(projects.alias, alias));
    return existingProject.length > 0;
  } catch (err) {
    console.error("Error checking if project exists:", err);
    throw err;
  }
};


