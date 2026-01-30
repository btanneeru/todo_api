const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../index");
const { connectWithRetry } = require("../../../config/mongodb");
const { loginTestUser } = require("../../user/controllers/auth/helpers/loginTestUser");

describe("Testing the User Auth APIs ", () => {
  // Define tofo variable.
  const endpointLogin = "/api/user/login";
  const endpointRegister = "/api/user/register";
  let loginBody = {
    email: "test2@gmail.com",
    password: "Test@123"
  }
  let registerBody = {
    name: "Test 34",
    email: "test34@gmail.com",
    password: "Test@123"
  }
  // Connects to database before test
  beforeAll(async () => {
    connectWithRetry();
  });
  // Closing the DB connection.
  afterAll(async () => {
    // mongoose.connection.close();
  });

  it("Should Login", async () => {
    // Sends GET Request
    const response = await request(app)
      .post(endpointLogin)
      .set("Content-Type", "application/json")
      .send(loginBody);
    // Check status code 200
    expect(response.status).toEqual(200);
  });

    it("Should Register", async () => {
    // Sends GET Request
    const response = await request(app)
      .post(endpointRegister)
      .set("Content-Type", "application/json")
      .send(registerBody);
      // Check status code 201
      expect(response.status).toEqual(404); //Already exsist
  });
});
