const express = require("express");
const bodyParser = require("body-parser");
const connector = require("./src/connector/db-connector");
var port = process.env.SERVER_PORT || 3000;
const app = express();
const sessions = require("express-session");
const cron = require("node-cron");
var http = require("http").Server(app);
app.use(bodyParser.json());
const dbModels = require("./src/model/init-model");
const cors = require("cors");
const moment = require("moment-timezone");
const logger = require("./logger");
app.use(
  cors({
    origin: "*",
  })
);
// / creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: true,
  })
);

connector.sequelize
  .authenticate()
  .then(() => {
    console.log("database connected!");
  })
  .catch((err) => {
    console.log("Error Creating database connection " + err);
  });

connector.sequelize
  .sync()
  .then((res) => {
    console.log("Database synchronised");
    const server = app.listen(port, () => {
      console.log("server is running on ");
    });
  })
  .catch((err) => {
    console.log("database synchronise failed!!!" + err);
  });

const authRoute = require("./src/router/auth-route");
const configRoute = require("./src/router/app-config-route");
const communityRoute = require("./src/router/community-route");
const eventRoute = require("./src/router/event-route");
const itemsRoute = require("./src/router/decoration-items-route");
const uploadRoute = require("./src/router/upload-file-route");
const path = require("path");
app.get("/api", (req, res) => {
  res.send("Welcome to my Node API!");
});
app.use("/api/auth", authRoute);
app.use("/api/config", configRoute);
app.use("/api/community", communityRoute);
app.use("/api/event", eventRoute);
app.use("/api/items", itemsRoute);
app.use("/api/file-upload", uploadRoute);
app.get("/api/stayawake", (req, res) => {
  const now = moment().tz("America/New_York").format("MM-DD-YYYY HH:mm:ss");
  res.send("I am Awake at " + now);
});
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
