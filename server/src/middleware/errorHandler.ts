import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err.message || err);

  res.status(500).json({
    message: "An error occurred",
    error: err.message || "Unknown error",
  });
}