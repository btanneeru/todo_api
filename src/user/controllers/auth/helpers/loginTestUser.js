exports.loginTestUser = (app, request) => {
  return request(app)
    .post("/api/user/login/")
    .set("Content-Type", "application/json")
    .send({
      email: process.env.TEST_USER_EMAIL,
      password: process.env.TEST_USER_PASSWORD,
    });
};
