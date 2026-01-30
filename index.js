const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const health = require("./src/v1/utils/health");
const mongoSanitize = require("express-mongo-sanitize");
const swagger = require("./swagger");
const swaggerUi = require("swagger-ui-express");

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });
const { TodoORM } = require("./src/v1/orm");

// Remove any keys containing prohibited characters
// Helps us to prevent NoSQL injections
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

//enables cors
app.use(cors());

// Add Body Parser
app.use(bodyParser.json({ limit: "60mb" }));
app.use(bodyParser.urlencoded({ limit: "60mb", extended: true }));

//Setting Res Headers
let setOrigin = "*";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", setOrigin);
  res.setHeader("Cache-Control", 9600);
  next();
});

//Load env variables
require("./config/envConfig").config();
console.log(`APP_ENVIRONMENT:::: ${process.env.env || process.env.ENV}`);
//Mongo DB Connection
require("./config/mongodb").connectWithRetry();

//Routing for user module
app.use("/api/user", require("./src/user/routes/auth"));
//Routing endpoints for todo modules
app.use("/api/v1/todo", require("./src/v1/routes/todo"));

//Endpoint for Checking application health 
app.use("/api/health-check", health.check);

//Enpoint for http://localhost:5000/
app.get("/", (req, res) => { res.send("Welcome To ToDo App API, Pls refer API Doc for Using this application: http://localhost:5000/api-docs/") });

// Swagger set up
app.use("/api-docs/", swagger.authenticationSystem, swaggerUi.serve, swaggerUi.setup());

//Defining Port number
const port = 5000;

//Socket connection
io.on('connection', (socket) => {
  console.log('user connected');
  setInterval(
    () => {
      TodoORM.getAllTodos()
        .then((result) => {
          socket.emit("notification", result.totalCount || 0);
        })
    },
    1000
  );
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});


//Connection to the node sever, listning to port 5000
server.listen(port, (err) => {
  if (err) {
    console.log("Error::", err);
  }
  console.log(`Running Node server from port - ${port}`);
});

