import express, { type Request, type Response } from "express";
import { z } from "zod";
import db from "../utils/db";
import { user } from "../utils/schema";
import { eq } from "drizzle-orm";

const router = express.Router();

router.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    const body = await bodySchema.parseAsync(req.body);

    const findUser = await db
      .select()
      .from(user)
      .where(eq(user.email, body.email));

    if (findUser.length === 0) {
      return res.status(401).json({
        message: "Email not found",
      });
    }

    if (findUser[0].password !== body.password) {
      return res.status(401).json({
        message: "Password incorrect",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user: findUser[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default router;
