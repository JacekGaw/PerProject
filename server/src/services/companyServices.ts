import { eq } from "drizzle-orm";
import db from "../database/db.js";
import { companies, companyUsers, users } from "../database/schemas.js";

interface CompanyUpdateData {
  name?: string;
  description?: string;
}

export const getCompaniesFromDB = async (companyId?: number): Promise<{}> => {
  try {
    let companiesList = {};
    if (companyId) {
        companiesList = await db.query.projects.findMany({
        where: eq(companies.id, companyId),
      });
    } else {
        companiesList = await db.query.companies.findMany();
    }
    return companiesList;
  } catch (err) {
    console.error("Error getting companies from the database:", err);
    throw err;
  }
};

export const getCompanyByUserId = async (userId: number): Promise<{}> => {
  try {
    const companyData = await db
    .select(
      {
      id: companies.id,
      name: companies.name,
      description: companies.description,
      createdAt: companies.createdAt
      // joinDate: companyUsers.joinDate,
      // active: companyUsers.active
    }
    )
    .from(companies)
    .innerJoin(companyUsers, eq(companyUsers.companyId, companies.id)) // Join companyUsers with companies
    .where(eq(companyUsers.userId, userId));
    const company = companyData[0];
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
}

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
    console.error("Error getting projects from the database:", err);
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
