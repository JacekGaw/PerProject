import { eq } from "drizzle-orm";
import db from "../database/db.js";
import { users } from "../database/schemas.js";
import bcrypt from "bcrypt";
import { hashPassword } from "../utils/passwordUtils.js";

interface UserUpdateData {
    email?: string;
    password?: string;
    role?: "Developer" | "Tester" | "Product Owner" | "Project Manager" | "Other";
    name?: string;
    surname?: string;
    phone?: number;
    active?: boolean;
  }

export const getUsersFromDB = async (): Promise<{}> => {
  try {
    const usersList = await db.query.users.findMany();
    return usersList;
  } catch (err) {
    console.error("Error getting users from the database:", err);
    throw err;
  }
};

export const getUserFromDB = async (givenId: number): Promise<{}> => {
  try {
    const singleUser = await db.query.users.findMany({
      where: eq(users.id, givenId),
    });
    return singleUser;
  } catch (err) {
    console.error("Error getting user from the database:", err);
    throw err;
  }
};

export const createUserInDB = async (
  email: string,
  password: string,
  role: "Developer" | "Tester" | "Product Owner" | "Project Manager" | "Other"
): Promise<{}> => {
  try {
    const hashedPassword = await hashPassword(password);
    const params = {
      email: email,
      password: hashedPassword,
      role: role,
    };
    const newUser = await db.insert(users).values(params).returning();
    return newUser;
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

export const updateUserInDB = async (data: UserUpdateData, userId: number): Promise<{}> => {
    try {
      const newUserData = {...data};
      if(newUserData.password){
        newUserData.password = await hashPassword(newUserData.password)
      }
      const updatedUser = await db.update(users)
      .set(newUserData)
      .where(eq( users.id, userId))
      .returning();
      return updatedUser
    } catch (err) {
      console.error("Error deleting user to the database:", err);
      throw err;
    }
  };