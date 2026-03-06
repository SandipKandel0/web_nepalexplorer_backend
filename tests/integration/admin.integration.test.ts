import request from "supertest";
import mongoose from "mongoose";
import { connectDB } from "../../src/database/mongodb";
import app from "../../src/app";
import { DestinationModel } from "../../src/models/destination";
import GuideRequestModel from "../../src/models/guide_request";

describe("Destination + Request + Admin Integration Tests", () => {
  beforeAll(async () => {
    await connectDB();
    await DestinationModel.deleteMany({});
    await GuideRequestModel.deleteMany({});
  });

  afterAll(async () => {
    await DestinationModel.deleteMany({});
    await GuideRequestModel.deleteMany({});
    await mongoose.connection.close();
  });

  test("GET /api/destinations - success", async () => {
    const res = await request(app).get("/api/destinations").expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("GET /api/guide/requests/all - success", async () => {
    const res = await request(app).get("/api/guide/requests/all").expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("POST /api/guide/requests - unauthorized without token", async () => {
    const res = await request(app)
      .post("/api/guide/requests")
      .send({
        guestName: "Guest One",
        guestEmail: "guest@example.com",
        guestPhone: "9800000000",
        tripDate: "2026-04-01",
        duration: 3,
        location: "Kathmandu",
        numberOfPeople: 2,
        language: "English",
      })
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  test("GET /api/guide/requests/my-requested-guides - unauthorized", async () => {
    const res = await request(app)
      .get("/api/guide/requests/my-requested-guides")
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  test("PATCH /api/guide/requests/:id/approve - unauthorized", async () => {
    const res = await request(app)
      .patch("/api/guide/requests/507f1f77bcf86cd799439011/approve")
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  test("GET /api/admin/users - unauthorized without token", async () => {
    const res = await request(app).get("/api/admin/users").expect(401);

    expect(res.body.success).toBe(false);
  });

  test("POST /api/admin/destinations - unauthorized without token", async () => {
    const res = await request(app)
      .post("/api/admin/destinations")
      .field("name", "Pokhara")
      .field("location", "Kaski")
      .expect(401);

    expect(res.body.success).toBe(false);
  });

  test("DELETE /api/admin/guides/:id - unauthorized without token", async () => {
    const res = await request(app)
      .delete("/api/admin/guides/507f1f77bcf86cd799439011")
      .expect(401);

    expect(res.body.success).toBe(false);
  });
});
