import request from "supertest";
import mongoose from "mongoose";
import { connectDB } from "../../src/database/mongodb";
import app from "../../src/app";
import { GuideModel } from "../../src/models/guide";

jest.mock("../../src/utils", () => ({
  sendResetPasswordEmail: jest.fn().mockResolvedValue(undefined),
}));

jest.setTimeout(20000);

describe("Guide Integration Tests", () => {
  let guideId: string;

  beforeAll(async () => {
    await connectDB();
    await GuideModel.deleteMany({});
  });

  afterAll(async () => {
    await GuideModel.deleteMany({});
    await mongoose.connection.close();
  });

  test("POST /api/guide/register - success", async () => {
    const res = await request(app)
      .post("/api/guide/register")
      .send({
        fullName: "Guide Tester",
        email: "guide.tester@example.com",
        password: "Password123",
        phone: "9800000001",
        language: "English",
        experience: "1-3",
        city: "Kathmandu",
        bio: "Test guide",
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("guide.tester@example.com");
    guideId = res.body.data.id;
  });

  test("POST /api/guide/register - missing fields", async () => {
    const res = await request(app)
      .post("/api/guide/register")
      .send({ email: "missing@example.com" })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  test("POST /api/guide/login - success", async () => {
    const res = await request(app)
      .post("/api/guide/login")
      .send({
        email: "guide.tester@example.com",
        password: "Password123",
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  test("POST /api/guide/login - invalid password", async () => {
    const res = await request(app)
      .post("/api/guide/login")
      .send({
        email: "guide.tester@example.com",
        password: "WrongPassword",
      })
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  test("POST /api/guide/forgot-password - success", async () => {
    const res = await request(app)
      .post("/api/guide/forgot-password")
      .send({ email: "guide.tester@example.com" })
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  test("GET /api/guide/:id - success", async () => {
    const res = await request(app)
      .get(`/api/guide/${guideId}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("guide.tester@example.com");
  });

  test("PUT /api/guide/:id - success", async () => {
    const res = await request(app)
      .put(`/api/guide/${guideId}`)
      .send({ city: "Pokhara" })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.city).toBe("Pokhara");
  });

  test("GET /api/guide - success", async () => {
    const res = await request(app)
      .get("/api/guide")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
