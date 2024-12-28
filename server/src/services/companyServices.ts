import { eq, count, inArray } from "drizzle-orm";
import db from "../database/db.js";
import {
  companies,
  companyUsers,
  projects,
  users,
  tasks,
  subTasks,
} from "../database/schemas.js";
import { decryptData, encryptData } from "../utils/encryption.js";

interface CompanyUpdateData {
  name?: string;
  description?: string;
}

type CompanySettings = {
  AI: { available: boolean; model: string; apiKey: string };
};

export const getCompaniesFromDB = async (
  companyId?: number
): Promise<
  (typeof companies.$inferSelect)[] | (typeof projects.$inferSelect)[]
> => {
  try {
    let companiesList:
      | (typeof companies.$inferSelect)[]
      | (typeof projects.$inferSelect)[];

    if (companyId) {
      companiesList = await db.query.projects.findMany({
        where: eq(companies.id, companyId),
      });
    } else {
      companiesList = await db.query.companies.findMany();
    }
    return companiesList;
  } catch (err) {
    throw err;
  }
};

export const getCompanyByUserId = async (userId: number): Promise<{}> => {
  try {
    const companyData = await db
      .select({
        id: companies.id,
        name: companies.name,
        description: companies.description,
        createdAt: companies.createdAt,
        settings: companies.settings,
      })
      .from(companies)
      .innerJoin(companyUsers, eq(companyUsers.companyId, companies.id)) // Join companyUsers with companies
      .where(eq(companyUsers.userId, userId));
    const company = companyData[0];
    const companySettings: CompanySettings =
      company.settings as CompanySettings;
    if (companySettings && companySettings.AI.apiKey !== "") {
      console.log(decryptData(companySettings.AI.apiKey));
      companySettings.AI.apiKey = decryptData(companySettings.AI.apiKey);
    }
    company.settings = companySettings;
    console.log(company);
    if (!company) {
      throw new Error(`No company found for userId ${userId}`);
    }
    const companyUsersArr = await db
      .select({
        id: users.id,
        name: users.name,
        surname: users.surname,
        email: users.email,
        role: users.role,
        active: companyUsers.active,
        joinDate: companyUsers.joinDate,
      })
      .from(users)
      .innerJoin(companyUsers, eq(companyUsers.userId, users.id))
      .where(eq(companyUsers.companyId, company.id));

    console.log(companyUsersArr);
    console.log(company);
    return {
      company,
      users: companyUsersArr,
    };
  } catch (err) {
    console.error("Error getting company by userId from the database:", err);
    throw err;
  }
};

export const getCompanyStatisticsFromDB = async (
  companyId: number
): Promise<{ projects: number; tasks: number; users: number }> => {
  const statistics = {
    projects: 0,
    tasks: 0,
    users: 0,
  };

  try {
    const projectCountResult = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.companyId, companyId));

    statistics.projects = projectCountResult[0].count;

    const projectIdsResult = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.companyId, companyId));

    const projectIds = projectIdsResult.map((project) => project.id);

    if (projectIds.length > 0) {
      const taskCountResult = await db
        .select({ count: count() })
        .from(tasks)
        .where(inArray(tasks.projectId, projectIds));

      const taskCount = taskCountResult[0].count;

      const taskIdsResult = await db
        .select({ id: tasks.id })
        .from(tasks)
        .where(inArray(tasks.projectId, projectIds));

      const taskIds = taskIdsResult.map((task) => task.id);

      let subTaskCount = 0;
      if (taskIds.length > 0) {
        const subTaskCountResult = await db
          .select({ count: count() })
          .from(subTasks)
          .where(inArray(subTasks.taskId, taskIds));

        subTaskCount = subTaskCountResult[0].count;
      }

      statistics.tasks = taskCount + subTaskCount;
    } else {
      statistics.tasks = 0;
    }

    const userCountResult = await db
      .select({ count: count() })
      .from(companyUsers)
      .where(eq(companyUsers.companyId, companyId));

    statistics.users = userCountResult[0].count;

    return statistics;
  } catch (err) {
    console.error("Error getting company statistics:", err);
    throw err;
  }
};

export const createNewCompanyInDB = async (
  name: string,
  description: string
): Promise<{}> => {
  try {
    const params = {
      name: name,
      description: description,
    };
    const newCompany = await db.insert(companies).values(params).returning();
    return newCompany;
  } catch (err) {
    console.error("Error creating new company in db:", err);
    throw err;
  }
};

export const deleteCompanyFromDb = async (companyId: number): Promise<{}> => {
  try {
    const deletedCompany = await db
      .delete(companies)
      .where(eq(companies.id, companyId))
      .returning();
    return deletedCompany;
  } catch (err) {
    console.error("Error deleting company from database:", err);
    throw err;
  }
};

export const updateCompanyInDB = async (
  data: CompanyUpdateData,
  companyId: number
): Promise<{}> => {
  try {
    const newCompanyData = { ...data };
    const updatedComyant = await db
      .update(companies)
      .set(newCompanyData)
      .where(eq(companies.id, companyId))
      .returning();
    return updatedComyant;
  } catch (err) {
    console.error("Error updating company:", err);
    throw err;
  }
};

export const updateCompanyAISettingsInDB = async (
  data: CompanySettings,
  companyId: number
): Promise<{}> => {
  try {
    const encryptedApiKey = encryptData(data.AI.apiKey);
    data.AI.apiKey = encryptedApiKey;
    const updatedCompany = await db
      .update(companies)
      .set({ settings: data })
      .where(eq(companies.id, companyId))
      .returning();
    return updatedCompany;
  } catch (err) {
    console.error("Error updating company AI settings:", err);
    throw err;
  }
};
