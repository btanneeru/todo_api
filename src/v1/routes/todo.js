const router = require("express").Router();
const { TodoService } = require("../services");
require("../../../config/passport");
const passport = require("passport");
const requireAuth = passport.authenticate(["jwt"], { session: false });
const trimRequest = require("trim-request");
const { validateTodo } = require("../middlewares/validators");

// get all todos
router.get("/", [
  requireAuth,
  TodoService.getAllTodos
]);

// Create todo api
router.post("/", [
  requireAuth,
  trimRequest.all, 
  validateTodo,
  TodoService.createTodo
]);

// get todo details by Id
router.get("/:todoId", [
  requireAuth,
  trimRequest.all,
  TodoService.getTodo
]);

// update todo details by Id
router.put("/:todoId", [
  requireAuth,
  trimRequest.all,
  validateTodo,
  TodoService.updateTodo
]);

// delete todo by Id
router.delete("/:todoId", [
  requireAuth,
  trimRequest.all,
  TodoService.deleteTodo
]);


module.exports = router;
