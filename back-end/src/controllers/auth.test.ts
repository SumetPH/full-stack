import request from "supertest";
import app from "../index";
import db from "../utils/db";
import bcrypt from "bcrypt";

jest.mock("bcrypt");

describe("test auth", () => {
  // login
  it("should return status 500 and error message for login", async () => {
    const res = await request(app).post("/api/auth/login").send({});

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: expect.anything(),
      message: expect.anything(),
      stack: expect.anything(),
    });
  });

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

  it("should return status 200 and token", async () => {
    // mock find email
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

    // mock compare password
    (bcrypt.compare as jest.Mock).mockReturnValue(true);

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "testtest",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Login successfully",
      token: expect.any(String),
    });
  });

  // register
  it("should return status 500 and error message for register", async () => {
    const res = await request(app).post("/api/auth/register").send({});

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: expect.anything(),
      message: expect.anything(),
      stack: expect.anything(),
    });
  });

  it("should return status 401 and message email already exists", async () => {
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

    const res = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "testtest",
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Email already exists",
    });
  });

  it("should return status 201 and message user created successfully", async () => {
    // mock find email
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([]),
    });

    // mock insert
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([
        {
          id: 1,
          email: "test1@test.com",
          password: "testtest",
          createdAt: "2024-09-24T14:58:55.141Z",
          updatedAt: "2024-09-24T14:58:55.141Z",
        },
      ]),
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "test1@test.com",
      password: "testtest",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "User created successfully",
      user: {
        id: 1,
        email: "test1@test.com",
        createdAt: "2024-09-24T14:58:55.141Z",
        updatedAt: "2024-09-24T14:58:55.141Z",
      },
    });
  });

  // user
  it("should return status 401 and message token not found", async () => {
    const res1 = await request(app).get("/api/auth/user");
    expect(res1.status).toBe(401);
    expect(res1.body.message).toBe("token not found");

    const res2 = await request(app).get("/api/auth/user").set({
      authorization: "abc",
    });
    expect(res2.status).toBe(401);
    expect(res2.body.message).toBe("token not found");
  });

  it("should return status 401 and message invalid token", async () => {
    const res = await request(app).get("/api/auth/user").set({
      authorization: "Bearer abc",
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("invalid token");
  });

  it("should return status 200 and user data", async () => {
    const res = await request(app).get("/api/auth/user").set({
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJ0ZXN0MUB0ZXN0LmNvbSIsImNyZWF0ZWRBdCI6IjIwMjQtMTAtMDFUMTM6MjU6MjcuNTY1WiIsInVwZGF0ZWRBdCI6IjIwMjQtMTAtMDFUMTM6MjU6MjcuNTY1WiIsImlhdCI6MTcyNzc2ODM0Mn0.tnL_K1u8kR4D4ZKs9b4BoWxyuqIuzNiLQSm80JR4WAc",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      user: {
        id: 3,
        email: "test1@test.com",
        createdAt: "2024-10-01T13:25:27.565Z",
        updatedAt: "2024-10-01T13:25:27.565Z",
        iat: 1727768342,
      },
    });
  });
});
