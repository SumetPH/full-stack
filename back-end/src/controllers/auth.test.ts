import request from "supertest";
import app from "../index";
import db from "../utils/db";

describe("test auth", () => {
  it("should return status 401 and message email not found", async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([]),
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "testtest",
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Email not found",
    });
  });

  it("should return status 401 and message password incorrect", async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([
        {
          id: 1,
          email: "test@test.com",
          password: "testtest",
          createdAt: "2024-09-24T14:58:55.141Z",
          updatedAt: "2024-09-24T14:58:55.141Z",
        },
      ]),
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "12345678",
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Password incorrect",
    });
  });

  it("should return status 200 and user data", async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([
        {
          id: 1,
          email: "test@test.com",
          password: "testtest",
          createdAt: "2024-09-24T14:58:55.141Z",
          updatedAt: "2024-09-24T14:58:55.141Z",
        },
      ]),
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "testtest",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Login successful",
      user: {
        id: 1,
        email: "test@test.com",
        password: "testtest",
        createdAt: "2024-09-24T14:58:55.141Z",
        updatedAt: "2024-09-24T14:58:55.141Z",
      },
    });
  });

  it("should return status 500 and error message", async () => {
    const res = await request(app).post("/api/auth/login").send({});

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: "Internal server error",
      error: expect.anything(),
    });
  });
});
