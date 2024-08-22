import { RequestHandler, Request } from "express";
import jwt, { Secret } from "jsonwebtoken";
import "dotenv/config";

interface CustomRequest extends Request {
  user?: any;
}

export const protectedRoute: RequestHandler = (
  req: CustomRequest,
  res,
  next
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || Array.isArray(authHeader)) {
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

  console.log("AccessToken Provided!");

  try {
    const accessTokenSecret: Secret = process.env.JWT_ACCESS_SECRET || "";
    const decoded = jwt.verify(
      accessToken,
      accessTokenSecret
    ) as jwt.JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).json({
      message: "Token not valid or expired",
    });
  }
};
