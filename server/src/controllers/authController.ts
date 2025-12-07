import { RequestHandler, Response } from "express";
import { getUserByEmail, createUserInDB } from "../services/userServices.js";
import { comparePasswords } from "../utils/passwordUtils.js";
import jwt, { SignOptions } from "jsonwebtoken";
import "dotenv/config";
import { CustomRequest } from "../middleware/protectedRoute.js";

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
    
    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    
    if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets are not configured");
    }
    
    const accessToken = jwt.sign(user, JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME || "15m",
    } as SignOptions);
    
    const refreshToken = jwt.sign(user, JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME || "7d",
    } as SignOptions);

    const { password, ...returnedUser } = user;
    return res.status(200).json({
      message: "Successfully logged in",
      user: returnedUser,
      accessToken,
      refreshToken,
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
    return res.status(201).json({
      message: "Successfully created an user",
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const refreshToken: RequestHandler = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
    
    if (!JWT_REFRESH_SECRET || !JWT_ACCESS_SECRET) {
      throw new Error("JWT secrets are not configured");
    }
    
    const decoded = jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET
    ) as jwt.JwtPayload;

    if (!decoded || !decoded.email) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await getUserByEmail(decoded.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accessToken = jwt.sign(user, JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME || "15m",
    } as SignOptions);

    return res.status(200).json({
      message: "Token refreshed successfully",
      accessToken,
    });
  } catch (err) {
    console.error("Error generating new access token:", err);
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};

export const verifyToken: RequestHandler = (
  req: CustomRequest,
  res: Response
) => {
  console.log(req.user);
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "User not found", error: "Unauthorized" });
  }
  return res
    .status(200)
    .send({ message: "Token verified successfully", user: req.user });
};