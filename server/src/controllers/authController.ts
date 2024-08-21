import { RequestHandler } from "express";
import { getUserByEmail } from "../services/userServices.js";
import { comparePasswords } from "../utils/passwordUtils.js";

export const logIn: RequestHandler = async (req, res) => {
  const userInfo = req.body;

  try {
    const user = await getUserByEmail(userInfo.email);
    if (!user) {
      return res.status(400).json({ message: "No user with provided email" });
    }
    const passwordMatch = await comparePasswords(
      userInfo.password,
      user.password
    );
    if(!passwordMatch){
        return res.status(401).json({message: "Wrong password for this user"});
    }
    console.log("Succesfuly logged in");
    return res.status(200).json({
        message: "Succesfuly logged in",
        user
    })
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: (err as Error).message || "Unknown error",
    });
  }
};
