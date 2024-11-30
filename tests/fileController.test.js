const request = require("supertest");
const app = require("../src/app"); // Adjust the path to your Express app
const User = require("../src/models/User.js");

describe("Authentication Controller", () => {
  afterAll(async () => {
    // Clean up the database after tests
    await User.deleteMany({});
  });

  it("should register a user and return a token in English", async () => {
    const response = await request(app)
      .post("/register") // Adjust the route as necessary
      .set("Accept-Language", "en") // Set the language to English
      .send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        language: "en",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
  });

  it("should register a user and return a token in Spanish", async () => {
    const response = await request(app)
      .post("/register") // Adjust the route as necessary
      .set("Accept-Language", "es") // Set the language to Spanish
      .send({
        username: "testuser2",
        email: "testuser2@example.com",
        password: "password123",
        language: "es",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
  });

  it("should login a user and return a token in English", async () => {
    // First, register the user
    await request(app).post("/register").send({
      username: "testuser3",
      email: "testuser3@example.com",
      password: "password123",
      language: "en",
    });

    const response = await request(app)
      .post("/login") // Adjust the route as necessary
      .set("Accept-Language", "en") // Set the language to English
      .send({
        email: "testuser3@example.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should login a user and return a token in Spanish", async () => {
    // First, register the user
    await request(app).post("/register").send({
      username: "testuser4",
      email: "testuser4@example.com",
      password: "password123",
      language: "es",
    });

    const response = await request(app)
      .post("/login") // Adjust the route as necessary
      .set("Accept-Language", "es") // Set the language to Spanish
      .send({
        email: "testuser4@example.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return an error message for invalid credentials in English", async () => {
    const response = await request(app)
      .post("/login")
      .set("Accept-Language", "en")
      .send({
        email: "nonexistent@example.com",
        password: "wrongpassword",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should return an error message for invalid credentials in Spanish", async () => {
    const response = await request(app)
      .post("/login")
      .set("Accept-Language", "es")
      .send({
        email: "nonexistent@example.com",
        password: "wrongpassword",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Credenciales inválidas");
  });
});
