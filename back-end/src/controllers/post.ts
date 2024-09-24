import express, { type Request, type Response } from "express";
import { z } from "zod";
import db from "../utils/db";
import { post } from "../utils/schema";

const router = express.Router();

router.post("/api/post", async (req: Request, res: Response) => {
  try {
    const bodySchema = z.object({
      title: z.string(),
      text: z.string(),
      userId: z.number(),
    });

    const body = await bodySchema.parseAsync(req.body);

    const newPost = await db
      .insert(post)
      .values({
        title: body.title,
        text: body.text,
        userId: body.userId,
      })
      .returning();

    return res.status(201).json({
      message: "Post created successfully",
      post: newPost[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default router;
