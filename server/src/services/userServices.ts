import { InferSelectModel, eq } from "drizzle-orm";
import db from "../database/db.js";
import { users, companyUsers, userFavourites } from "../database/schemas.js";
import { comparePasswords, hashPassword } from "../utils/passwordUtils.js";

interface UserUpdateData {
  email?: string;
  password?: string;
  role?: "Developer" | "Tester" | "Product Owner" | "Project Manager" | "Other";
  name?: string;
  surname?: string;
  phone?: string;
  active?: boolean;
}

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

interface NewUser {
  id: number;
  email: string;
  password: string;
  role: "Developer" | "Tester" | "Product Owner" | "Project Manager" | "Other";
  name?: string;
  surname?: string;
}

interface UserOBj {
  user: InferSelectModel<typeof users>;
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

export const getUserInfoFromDB = async (userId: number): Promise<{}> => {
  try {
    const userObject = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        surname: users.surname,
        phone: users.phone,
        role: users.role,
        createdAt: users.createdAt,
        joinDate: companyUsers.joinDate,
      })
      .from(users)
      .innerJoin(companyUsers, eq(users.id, companyUsers.userId))
      .where(eq(users.id, userId));

    console.log(userObject);
    return userObject;
  } catch (err) {
    console.error("Error getting user info from the database:", err);
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

export const getUserBookmarksFromDB = async (userId: number) => {
  try {
    const bookmarks = await db
      .select()
      .from(userFavourites)
      .where(eq(userFavourites.userId, userId));
    return bookmarks;
  } catch (err) {
    console.error("Error getting user bookmarks: ", err);
    throw err;
  }
};

export const createUserInDB = async (
  email: string,
  password: string,
  role: "Developer" | "Tester" | "Product Owner" | "Project Manager" | "Other",
  name?: string,
  surname?: string,
  admin?: boolean
): Promise<NewUser> => {
  try {
    const hashedPassword = await hashPassword(password);
    const params = {
      email: email,
      password: hashedPassword,
      role: role,
      name: name,
      surname: surname,
      admin: admin
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
    const updatedUser = await db
      .update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning();
    return updatedUser[0];
  } catch (err) {
    console.error("Error updating user to the database:", err);
    throw err;
  }
};

export const changeUserPasswordInDB = async (
  data: ChangePasswordData,
  userId: number
): Promise<{} | null> => {
  try {
    const userInfo = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!userInfo) {
      throw new Error("User not found");
    }

    const isOldPasswordCorrect = await comparePasswords(
      data.oldPassword,
      userInfo.password
    );
    if (!isOldPasswordCorrect) {
      return null;
    }

    const hashedNewPassword = await hashPassword(data.newPassword);

    const [updatedUser] = await db
      .update(users)
      .set({ password: hashedNewPassword })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  } catch (err) {
    console.error("Error updating user in the database:", err);
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
