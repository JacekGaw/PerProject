import { RequestHandler } from "express";
import { getUserByEmail, createUserInDB } from "../services/userServices.js";
import { comparePasswords } from "../utils/passwordUtils.js";

interface UserSingUpCredentials {
  email: string;
  password: string;
  role: "Developer" | "Tester" | "Product Owner" | "Project Manager" | "Other";
  name: string;
  surname: string;
}

interface UserLoginCredentials {
  email: string;
  password: string;
}

export const logIn: RequestHandler = async (req, res) => {
  const userInfo = req.body as UserLoginCredentials;

  try {
    const user = await getUserByEmail(userInfo.email);
    if (!user) {
      return res.status(400).json({ message: "No user with provided email" });
    }
    const passwordMatch = await comparePasswords(
      userInfo.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ message: "Wrong password for this user" });
    }
    console.log("Successfully logged in");
    return res.status(200).json({
      message: "Successfully logged in",
      user,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const signUp: RequestHandler = async (req, res) => {
  const userInfo = req.body as UserSingUpCredentials;

  try {
    const user = await getUserByEmail(userInfo.email);
    if (user) {
      return res
        .status(409)
        .json({ message: "User with provided email already exist!" });
    }
    const newUser = await createUserInDB(
      userInfo.email,
      userInfo.password,
      userInfo.role,
      userInfo.name,
      userInfo.surname
    );
    if (!newUser) {
      return res.status(400).json({ message: "Couldn't add new user" });
    }
    console.log("Successfully created an user");
    return res.status(201).json({
      message: "Successfully created an user",
      user: newUser,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};
