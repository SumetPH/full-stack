import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { z } from "zod";
import db from "../utils/db";
import { user } from "../utils/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/auth/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
      });

      const body = await bodySchema.parseAsync(req.body);

      // check if user exists
      const findUser = await db
        .select()
        .from(user)
        .where(eq(user.email, body.email));

      if (findUser.length === 0) {
        return res.status(401).json({
          message: "Email not found",
        });
      }

      // check if password is correct
      const checkPassword = await bcrypt.compare(
        body.password,
        findUser[0].password
      );

      if (!checkPassword) {
        return res.status(401).json({
          message: "Password incorrect",
        });
      }

      const token = jwt.sign(
        {
          id: findUser[0].id,
          email: findUser[0].email,
          createdAt: findUser[0].createdAt,
          updatedAt: findUser[0].updatedAt,
        },
        process.env.JWT_SECRET as string
      );

      return res.status(200).json({
        message: "Login successfully",
        token: token,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/auth/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
      });

      const body = await bodySchema.parseAsync(req.body);

      // check if user exists
      const findUser = await db
        .select()
        .from(user)
        .where(eq(user.email, body.email));

      if (findUser.length !== 0) {
        return res.status(401).json({
          message: "Email already exists",
        });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(body.password, 10);

      const newUser = await db
        .insert(user)
        .values({
          email: body.email,
          password: hashedPassword,
        })
        .returning();

      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: newUser[0].id,
          email: newUser[0].email,
          createdAt: newUser[0].createdAt,
          updatedAt: newUser[0].updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/auth/user",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      const decodedToken = jwt.verify(
        token as string,
        process.env.JWT_SECRET as string
      ) as { id: number; email: string; createdAt: string; updatedAt: string };

      return res.status(200).json({
        user: decodedToken,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
