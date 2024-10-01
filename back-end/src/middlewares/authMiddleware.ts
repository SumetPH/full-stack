import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
          if (err) {
            throw new Error("invalid token");
          } else {
            const user = decoded as {
              id: number;
              email: string;
              createdAt: string;
              updatedAt: string;
            };
            req.user = user;
            next();
          }
        });
      } else {
        throw new Error("token not found");
      }
    } else {
      throw new Error("token not found");
    }
  } catch (error: any) {
    console.error(error);
    return res.status(401).json({
      error: error,
      message: error.message,
      stack: error.stack,
    });
  }
};
