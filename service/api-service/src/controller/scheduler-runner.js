const schedulerService = require("../service/scheduler-service");
const moment = require("moment-timezone");
exports.runScheduler = async (req,res,next)=>{
    try {
        const todayEDT = moment().tz("America/New_York").format("YYYY-MM-DD");
        let response = await schedulerService.generateDailyMailAndSms(todayEDT);
        return res.status(200).json({
          message: "Scheduler Run Successfull",
          body: response,
        });
      } catch (error) {
        return res.status(404).json({
          message: "Scheduler Run Failed: " + error.message
        });
      }
}