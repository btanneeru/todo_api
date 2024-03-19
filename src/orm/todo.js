const Todo = require("../models/todo");

// Get all todos with filter
exports.getAllTodos = (query, limit, page, sort) => {
  return new Promise((resolve, reject) => {
    Todo.find(query)
      .sort(sort)
      // .skip(limit * page - limit)
      // .limit(limit)
      .exec()
      .then((docs) => {
        Todo.countDocuments(query)
          .then((totalCount) => {
            resolve({ docs: docs, totalCount: totalCount });
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Add Todo record
exports.addTodo = (data) => {
  return new Promise((resolve, reject) => {
    const todo = new Todo({ ...data });
    todo
      .save()
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Get todo by id
exports.getTodoById = (id) => {
  return new Promise((resolve, reject) => {
    let condition = { _id: id };
    Todo.find(condition)
      .select("-__v")
      .exec()
      .then((doc) => {
        resolve(doc[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Update todo record by id
exports.updateTodo = (id, data) => {
  return new Promise((resolve, reject) => {
    Todo.updateOne({ _id: id }, { $set: data }, { new: true })
      .exec()
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Delete todo by id
exports.deleteTodoById = (id) => {
  return new Promise((resolve, reject) => {
    let condition = { _id: id };
    Todo.deleteOne(condition)
      .exec()
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
