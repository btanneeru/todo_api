const router = require("express").Router();
const { TodoService } = require("../services");
const trimRequest = require("trim-request");
const { validateTodo } = require("../middlewares/validators");

// get all todos
router.get("/", [
  TodoService.getAllTodos
]);

// Create todo api
router.post("/", [
  trimRequest.all, 
  validateTodo,
  TodoService.createTodo
]);

// get todo details by Id
router.get("/:todoId", [
  trimRequest.all,
  TodoService.getTodo
]);

// update todo details by Id
router.put("/:todoId", [
  trimRequest.all,
  validateTodo,
  TodoService.updateTodo
]);

// delete todo by Id
router.delete("/:todoId", [
  trimRequest.all,
  TodoService.deleteTodo
]);


module.exports = router;
