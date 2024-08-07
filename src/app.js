const restify = require("restify");
const send = require("send");
const fs = require("fs");

// Create HTTP server.
const server = restify.createServer({
  key: process.env.SSL_KEY_FILE ? fs.readFileSync(process.env.SSL_KEY_FILE) : undefined,
  certificate: process.env.SSL_CRT_FILE ? fs.readFileSync(process.env.SSL_CRT_FILE) : undefined,
  formatters: {
    "text/html": function (req, res, body) {
      return body;
    },
  },
});

// Serve static files
server.get(
  "/static/*",
  restify.plugins.serveStatic({
    directory: __dirname + '/static',
  })
);

//! DO NOT TOUCH THESE, JUST ADD!!!!!!
// Setup home page
server.get("/", (req, res, next) => {
  send(req, __dirname + "/views/index.html").pipe(res);
});

// Setup the static tab
server.get("/tab", (req, res, next) => {
  send(req, __dirname + "/views/index.html").pipe(res);
});

// Setup other routes for different HTML files
server.get("/tasks", (req, res, next) => {
  send(req, __dirname + "/views/tasks.html").pipe(res);
});

server.get("/taskDetails", (req, res, next) => {
  send(req, __dirname + "/views/taskDetails.html").pipe(res);
});

server.get("/styles", (req, res, next) => {
  send(req, __dirname + "/static/styles/styles.css").pipe(res);
});

server.get("/style", (req, res, next) => {
  send(req, __dirname + "/static/styles/style.css").pipe(res);
});

server.get("/taskscss", (req, res, next) => {
  send(req, __dirname + "/static/styles/tasks.css").pipe(res);
});

server.get("/script", (req, res, next) => {
  send(req, __dirname + "/static/scripts/main.js").pipe(res);
});

server.get("/taskDetailsjs", (req, res, next) => {
  send(req, __dirname + "/static/scripts/taskDetails.js").pipe(res);
});

server.get("/tasksjs", (req, res, next) => {
  send(req, __dirname + "/static/scripts/tasks.js").pipe(res);
});

server.get("/gif", (req, res, next) => {
  send(req, __dirname + "/views/Working.gif").pipe(res);
});


// Start the server
server.listen(process.env.port || process.env.PORT || 3333, function () {
  console.log(`\n${server.name} listening to ${server.url}`);
});
