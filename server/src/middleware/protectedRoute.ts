import { RequestHandler, Request } from "express";
import jwt, { Secret } from "jsonwebtoken";
import "dotenv/config";

export interface DecodedUser extends jwt.JwtPayload {
  id: string;
  email: string;
}

export interface CustomRequest extends Request {
  user?: DecodedUser;
}

export const protectedRoute: RequestHandler = (
  req: CustomRequest, res, next
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization token not provided",
    });
  }
  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({
      message: "Authorization token not provided",
    });
  }
  const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
  if (!accessTokenSecret) {
    throw new Error(
      "JWT_ACCESS_SECRET is not defined in environment variables"
    );
  }
  try {
    const decoded = jwt.verify(
      accessToken,
      accessTokenSecret as Secret
    ) as DecodedUser;
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).json({
      message: "Token not valid or expired",
    });
  }
};
