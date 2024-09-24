import request from "supertest";
import app from "../index";
import db from "../utils/db";

describe("test post", () => {
  it("should return status 500 when invalid body", async () => {
    const res = await request(app).post("/api/post").send({});

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: "Internal server error",
      error: expect.anything(),
    });
  });

  it("should return status 201 and Post created successfully", async () => {
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([
        {
          id: 1,
          title: "title test",
          text: "text test",
          userId: 1,
          createdAt: "2024-09-24T15:23:15.729Z",
          updatedAt: "2024-09-24T15:23:15.729Z",
        },
      ]),
    });

    const res = await request(app).post("/api/post").send({
      title: "title test",
      text: "text test",
      userId: 1,
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "Post created successfully",
      post: {
        id: 1,
        title: "title test",
        text: "text test",
        userId: 1,
        createdAt: "2024-09-24T15:23:15.729Z",
        updatedAt: "2024-09-24T15:23:15.729Z",
      },
    });
  });
});
