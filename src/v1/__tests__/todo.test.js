const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../index");
const { connectWithRetry } = require("../../../config/mongodb");
const { loginTestUser } = require("../../user/controllers/auth/helpers/loginTestUser");

describe("Testing the Todo API ", () => {
  // Define tofo variable.
  let todoId;
  let todoBody = {
    title: "Test-v2",
    completed: false
  };
  const endpointTodo = "/api/v1/todo/";
  let token;
  // Connects to database before test
  beforeAll(async () => {
    connectWithRetry();
    const response = await loginTestUser(app, request);
    token = response.body.token;
  });
  // Closing the DB connection.
  afterAll(async () => {
    // mongoose.connection.close();
  });

  it("Should fetch Todo", async () => {
    // Sends GET Request
    const response = await request(app)
      .get(endpointTodo)
      .set("Authorization", `Bearer ${token}`);
    // Check status code 200
    expect(response.status).toEqual(200);
  });

  it("Should fetch todo with default limit 10", async () => {
    // Sends GET Request
    const response = await request(app)
      .get(endpointTodo)
      .set("Authorization", `Bearer ${token}`);
    // Check todo array length is 10
    expect(response.body.todos.length <= 10).toBe(true);
  });

  it("Should fetch todos with limit 2", async () => {
    // Sends GET Request
    const response = await request(app)
      .get(endpointTodo)
      .set("Authorization", `Bearer ${token}`)
      .query({ limit: 2 });
    // Check todos array length is 2
    expect(response.body.todos.length).toEqual(2);
  });

  it("Should fetch todo with default sortBy modified_on desc", async () => {
    // Sends GET Request
    const response = await request(app)
      .get(endpointTodo)
      .set("Authorization", `Bearer ${token}`);
    expect(
      response.body.todos.map((todo) => {
        return todo.modified_on;
      })
    ).toStrictEqual(
      response.body.todos
        .map((todo) => {
          return todo.modified_on;
        })
        .sort()
        .reverse()
    );
  });

  it("Should fetch todos with sortBy name desc", async () => {
    // Sends GET Request
    const response = await request(app)
      .get(endpointTodo)
      .set("Authorization", `Bearer ${token}`)
      .query({
        sortBy: "title",
        orderBy: "desc",
      });
    expect(
      response.body.todos.map((todo) => {
        return todo.title;
      })
    ).toStrictEqual(
      response.body.todos
        .map((todo) => {
          return todo.title;
        })
        .sort()
        .reverse()
    );
  });

  it("Should fetch todos with sortBy recently added", async () => {
    // Sends GET Request
    const response = await request(app)
      .get(endpointTodo)
      .set("Authorization", `Bearer ${token}`)
      .query({
        sortBy: "created_on",
        orderBy: "desc",
      });
    expect(
      response.body.todos.map((todos) => {
        return todos.created_on;
      })
    ).toStrictEqual(
      response.body.todos
        .map((todo) => {
          return todo.created_on;
        })
        .sort()
        .reverse()
    );
  });

  it("Should fetch todos with sortBy recently edited", async () => {
    // Sends GET Request
    const response = await request(app)
      .get(endpointTodo)
      .set("Authorization", `Bearer ${token}`)
      .query({
        sortBy: "modified_on",
        orderBy: "desc",
      });
    expect(
      response.body.todos.map((todo) => {
        return todo.modified_on;
      })
    ).toStrictEqual(
      response.body.todos
        .map((todo) => {
          return todo.modified_on;
        })
        .sort()
        .reverse()
    );
  });

  it("Should fetch todos with name contains 'c India hhshs'", async () => {
    // Sends GET Request
    const response = await request(app)
      .get(endpointTodo)
      .set("Authorization", `Bearer ${token}`)
      .query({
        name_contains: "c India hhshs",
      });
    // Check have todos
    expect(
      response.body.todos.some(({ title }) => title.includes("c India hhshs"))
    ).toBe(true);
  });

  it("Should fetch todos with todos starts with Task", async () => {
    // Sends GET Request
    const response = await request(app)
      .get(endpointTodo)
      .set("Authorization", `Bearer ${token}`)
      .query({
        name_startswith: "Task",
      });
    // Check have todos
    expect(response.body.todos.some(({ title }) => title.startsWith("Task"))).toBe(
      true
    );
  });

  it("Should create todo", async () => {
    // Sends POST Request
    const response = await request(app)
      .post(endpointTodo)
      .set("Authorization", `Bearer ${token}`)
      .send(todoBody);
    expect(response.status).toEqual(201);
    todoId =
      response.body.todo != undefined
        ? response.body.todo._id
        : undefined;
  });

    it("Should get todo", async () => {
    // Sends GET Request
    const response = await request(app)
      .get(endpointTodo + todoId)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.body.title).toStrictEqual(todoBody.title);
  });

  it("Should update todo", async () => {
    todoBody = {
      title: "String",
      ...todoBody,
    };
    // Sends PUT Request
    const response = await request(app)
      .put(endpointTodo + todoId)
      .set("Authorization", `Bearer ${token}`)
      .send(todoBody);
    expect(response.status).toEqual(200);
  });
  

  it("Should delete todo", async () => {
    // Sends DELETE Request
    const response = await request(app)
      .delete(endpointTodo + todoId)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(200);
  });
});
