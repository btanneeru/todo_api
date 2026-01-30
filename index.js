const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const health = require("./src/v1/utils/health");
const mongoSanitize = require("express-mongo-sanitize");
const swagger = require("./swagger");
const swaggerUi = require("swagger-ui-express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const { TodoORM } = require("./src/v1/orm");

// Remove any keys containing prohibited characters
app.use(
  mongoSanitize({
    replaceWith: "_",
    onSanitize: ({ req, key }) => {
      console.log(
        `Request: ${req.originalUrl} | This request[${key}] is sanitized`
      );
    },
  })
);

// enables cors
app.use(cors());

// Add Body Parser
app.use(bodyParser.json({ limit: "60mb" }));
app.use(bodyParser.urlencoded({ limit: "60mb", extended: true }));

// Setting Res Headers
let setOrigin = "*";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", setOrigin);
  res.setHeader("Cache-Control", 9600);
  next();
});

// HTTP request logger
app.use(require("morgan")("dev"));

// Load env variables
require("./config/envConfig").config();
console.log(`APP_ENVIRONMENT:::: ${process.env.env || process.env.ENV}`);

// Mongo DB Connection
require("./config/mongodb").connectWithRetry();

// Routing for user module
app.use("/api/user", require("./src/user/routes/auth"));

// Routing endpoints for todo modules
app.use("/api/v1/todo", require("./src/v1/routes/todo"));

// Endpoint for Checking application health
app.use("/api/health-check", health.check);

// Root endpoint
app.get("/", (req, res) => {
  res.send(
    "Welcome To ToDo App API, Pls refer API Doc for Using this application: http://localhost:5000/api-docs/"
  );
});

// Swagger set up
app.use("/api-docs/v1", swagger.v1, swaggerUi.serve, swaggerUi.setup());
app.use("/api-docs/user", swagger.user, swaggerUi.serve, swaggerUi.setup());

// Socket connection
io.on("connection", (socket) => {
  console.log("user connected");
  setInterval(() => {
    TodoORM.getAllTodos().then((result) => {
      socket.emit("notification", result.totalCount || 0);
    });
  }, 1000);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const port = 5000;
if (process.env.env !== "test") {
  server.listen(port, (err) => {
    if (err) {
      console.log("Error::", err);
    }
    console.log(`Running Node server from port - ${port}`);
  });
}

module.exports = app;
