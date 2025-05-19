const express = require("express");
const router = express.Router();
const schedulerRunner = require("../controller/scheduler-runner");

router.get("/run", schedulerRunner.runScheduler);

module.exports = router;
