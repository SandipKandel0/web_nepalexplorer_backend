import request from "supertest";
import mongoose from "mongoose";
import { connectDB } from "../../src/database/mongodb";
import app from "../../src/app";
import UserModel from "../../src/models/user";

jest.mock("../../src/utils", () => ({
  sendResetPasswordEmail: jest.fn().mockResolvedValue(undefined),
}));

// Increase default Jest timeout for async operations
jest.setTimeout(20000);

describe("User Integration Tests", () => {
  let userId: string;
  let token: string;

  beforeAll(async () => {
    await connectDB();
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await mongoose.connection.close();
  });

  // 1️⃣ Register User
  test("POST /api/user/register - success", async () => {
    const res = await request(app)
      .post("/api/user/register")
      .send({
        fullName: "Test User",
        email: "test@example.com",
        password: "Password123",
        confirmPassword: "Password123",
        phone: "1234567890",
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("test@example.com");
    userId = res.body.data.id;
  });

  // 2️⃣ Login User
  test("POST /api/user/login - success", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({
        email: "test@example.com",
        password: "Password123",
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    token = res.body.data.token;
  });

  // 3️⃣ Forgot Password
  test(
    "POST /api/user/forgot-password - success",
    async () => {
      const res = await request(app)
        .post("/api/user/forgot-password")
        .send({ email: "test@example.com" })
        .expect(200);

      expect(res.body.success).toBe(true);
    },
    10000 // timeout for async operation
  );

  // 4️⃣ Login User - invalid password
  test("POST /api/user/login - invalid password", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: "test@example.com", password: "WrongPassword" })
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  // 5️⃣ Get User by ID
  test("GET /api/user/:id - success", async () => {
    const res = await request(app)
      .get(`/api/user/${userId}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("test@example.com");
  });

  // 6️⃣ Update User
  test("PUT /api/user/:id - success", async () => {
    const res = await request(app)
      .put(`/api/user/${userId}`)
      .send({ fullName: "Updated Test User" })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.fullName).toBe("Updated Test User");
  });
});