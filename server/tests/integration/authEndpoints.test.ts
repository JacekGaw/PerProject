import request from "supertest";
import app from "../../src/index";

describe("Auth endpoints (integration)", () => {
  const testUser = {
    email: "testUser@test.com",
    password: "testPassword123",
  };
  afterAll((done) => {
    done();
  });
  it("should return 200 and token for valid credentials", async () => {
    const response = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
  });

  it("should return 401 for invalid credentials", async () => {
    const response = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: "WrongPassword123",
    });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Wrong password for this user"
    );
  });
});
