import { eq } from "drizzle-orm";
import db from "../database/db.js";
import { users, companyUsers } from "../database/schemas.js";
import { hashPassword } from "../utils/passwordUtils.js";

interface UserUpdateData {
  email?: string;
  password?: string;
  role?: "Developer" | "Tester" | "Product Owner" | "Project Manager" | "Other";
  name?: string;
  surname?: string;
  phone?: string;
  active?: boolean;
}

interface NewUser {
  id: number;
  email: string;
  password: string;
  role: "Developer" | "Tester" | "Product Owner" | "Project Manager" | "Other";
  name?: string;
  surname?: string;
}

export const getUsersFromDB = async (userId?: number): Promise<{}> => {
  try {
    let usersList = {};
    if (userId) {
      usersList = await db.query.users.findMany({
        where: eq(users.id, userId),
      });
    } else {
      usersList = await db.query.users.findMany();
    }
    return usersList;
  } catch (err) {
    console.error("Error getting users from the database:", err);
    throw err;
  }
};

export const getUserByEmail = async (userEmail: string) => {
  try {
    const user = db.query.users.findFirst({
      where: eq(users.email, userEmail),
    });
    return user;
  } catch (err) {
    console.error("Error getting user by email: ", err);
    throw err;
  }
};

export const createUserInDB = async (
  email: string,
  password: string,
  role: "Developer" | "Tester" | "Product Owner" | "Project Manager" | "Other",
  name?: string,
  surname?: string
): Promise<NewUser> => {
  try {
    const hashedPassword = await hashPassword(password);
    const params = {
      email: email,
      password: hashedPassword,
      role: role,
      name: name,
      surname: surname,
    };
    const [newUser] = await db.insert(users).values(params).returning();
    return newUser as NewUser;
  } catch (err) {
    console.error("Error adding user to the database:", err);
    throw err;
  }
};

export const deleteUserFromDb = async (usersId: number): Promise<{}> => {
  try {
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, usersId))
      .returning();
    return deletedUser;
  } catch (err) {
    console.error("Error deleting user to the database:", err);
    throw err;
  }
};

export const updateUserInDB = async (
  data: UserUpdateData,
  userId: number
): Promise<{}> => {
  try {
    const newUserData = { ...data };
    if (newUserData.password) {
      newUserData.password = await hashPassword(newUserData.password);
    }
    const updatedUser = await db
      .update(users)
      .set(newUserData)
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  } catch (err) {
    console.error("Error updating user to the database:", err);
    throw err;
  }
};

export const assignUserToCompany = async (
  userId: number,
  companyId: number
): Promise<{}> => {
  try {
    const params = {
      userId,
      companyId,
    };
    const newAssignment = await db
      .insert(companyUsers)
      .values(params)
      .returning();
    return newAssignment;
  } catch (err) {
    console.error("Error assigning user to company:", err);
    throw err;
  }
};
