const { TodoORM } = require("../orm");
const CODE = require("../utils/httpResponseCode");
const _ = require("lodash");
const mongoose = require("mongoose");
const escapeRegex = require("../../utils/regex-escape");
const { nameContainsNumbersQuery } = require("../utils/commonConstants");
// Get all todos
exports.getAllTodos = (req, res) => {
    try {
        let query = {};
        let sort = {};
        // declare pagination variables
        const limit =
        req.query.limit !== undefined && parseInt(req.query.limit) > 0
            ? parseInt(req.query.limit)
            : 10;
        const page =
        req.query.page !== undefined && parseInt(req.query.page) > 0
            ? parseInt(req.query.page)
            : 1;
        
        if (req.query.sortBy !== undefined && req.query.orderBy !== undefined) {
            sort[req.query.sortBy] = req.query.orderBy === "desc" ? -1 : 1;
        } else {
            sort.modified_on = -1;
        }
        if (req.query.name_contains !== undefined) {
            query.title = new RegExp("^" + escapeRegex(req.query.name_contains), "gi");
        }
        if (req.query.name_startswith !== undefined) {
            query.title = new RegExp(
                "^" + escapeRegex(req.query.name_startswith),
                "gi"
            );
        } else if (
            req.query.name_contains_number !== undefined &&
            req.query.name_contains_number == "true"
        ) {
            query.title = { $in: nameContainsNumbersQuery };
        }
        console.log(query)
        TodoORM.getAllTodos(query, limit, page, sort)
        .then(async(result) => {
            res.status(CODE.EVERYTHING_IS_OK).json({
                current_page: page,
                total_record: result.totalCount,
                per_page: limit,
                previous_page: page - 1 > 0 ? page - 1 : undefined,
                last_page: Math.ceil(result.totalCount / limit),
                next_page: result.totalCount > limit * page ? page + 1 : undefined,
                todos: result.docs,
            });
        })
        .catch((err) => {
            res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
        });
    } catch (error) {
        return res.status(CODE.INTERNAL_SERVER_ERROR).send({err: error, message: `Something Went wrong in API`});
    }
};

// Create todo record
exports.createTodo = async (req, res) => {
    try {
        if (req.body.title === undefined) {
            return res.status(CODE.BAD_REQUEST).json({ message: "Invalid Arguments" });
        }
        TodoORM.addTodo({
            title: req.body.title,
            completed: req.body.completed,
        })
        .then((doc) => {
            res
            .status(CODE.NEW_RESOURCE_CREATED)
            .json({ message: `Todo created successfully!`, todo: doc });
        })
        .catch((err) => {
            res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
        });
    } catch (error) {
        return res.status(200).send({err: error, message: `Something Went wrong in CMS`});
    }
};

// Get todo by id
exports.getTodo = (req, res) => {
    try {
        if (
            req.params.todoId !== undefined && !mongoose.isValidObjectId(req.params.todoId)
        ) {
            return res.status(CODE.NOT_FOUND).json({ message: MESSAGE.INVALID_VALUE });
        }
        const id = new mongoose.Types.ObjectId(req.params.todoId);
        TodoORM.getTodoById(id)
        .then(async (doc) => {
            if (!_.isEmpty(doc)) {
                res.status(CODE.EVERYTHING_IS_OK).json(doc);
            } else {
                res.status(CODE.NOT_FOUND).json({ message: "No record found" });
            }
        })
        .catch((err) => {
            res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
        });
    } catch (error) {
        console.log(error)
        return res.status(200).send({err: error, message: `Something Went wrong in API`});
    }
};

// Update tdod by id
exports.updateTodo = (req, res) => {
    try {
        const id = req.params.todoId;
        if (_.isEmpty(req.body)) {
            return res.status(CODE.NOT_FOUND).json({ message: "Invalid Arguments" });
        }
        TodoORM.getTodoById(id)
        .then((doc) => {
            if (doc) {
            let updateOps = {};
            if (req.body.title !== undefined) {
                updateOps.title = req.body.title;
            }
            if (req.body.completed !== undefined) {
                updateOps.completed = req.body.completed;
            }
            TodoORM.updateTodo(id, updateOps)
                .then((doc) => {
                    res.status(CODE.EVERYTHING_IS_OK)
                    .json({ message: `Todo updated successfully!` });
                })
                .catch((err) => {
                    res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
                });
            } else {
            res
                .status(CODE.NOT_FOUND)
                .json({ message: "No record found!" });
            }
        })
        .catch((err) => {
            res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
        });
    } catch (error) {
        console.log(error)
        return res.status(200).send({err: error, message: `Something Went wrong in API`});
    }
};

// Delete tdod by id
exports.deleteTodo = (req, res) => {
    try {
        const id = req.params.todoId;
        if (_.isEmpty(req.params.todoId)) {
            return res.status(CODE.NOT_FOUND).json({ message: "Invalid Arguments" });
        }
        TodoORM.getTodoById(id)
        .then((doc) => {
            if (doc) {
                TodoORM.deleteTodoById(id)
                    .then((doc) => {
                        res.status(CODE.EVERYTHING_IS_OK)
                        .json({ message: `Todo Deleted successfully!` });
                    })
                    .catch((err) => {
                        res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
                    });
            } else {
                res.status(CODE.NOT_FOUND).json({ message: "No record found!" });
            }
        })
        .catch((err) => {
            res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
        });
    } catch (error) {
        console.log(error)
        return res.status(200).send({err: error, message: `Something Went wrong in API`});
    }
};
