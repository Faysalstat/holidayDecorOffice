const logger = require("../../logger");
const sendMail = require("../mail/mailer");
const commonService = require("./common-service");
exports.generateDailyMailAndSms = async (todayEDT) => {
  try {
    todayEDT = "2025-05-15";
    let response = await commonService.getAllEventByStatusAndDate(
      "active",
      todayEDT
    );
    let eventList = response.eventSummary;
    let itemList = response.requiredItemList;
    if (eventList && eventList.length > 0) {
      logger.info("Job Execution Log", {
        job_name: "Job Scheduler",
        job_type: "Scheduler",
        status: "Scheduler Running",
        error_message: `${eventList.length} Event found`,
      });
      let emailBody = await generateTaskListEmailBody(eventList, itemList);
      let subject = "Today's Decor office Task"
      sendMail("faysalstat04@gmail.com", subject, emailBody);
      sendMail("doggydutypro@gmail.com", subject, emailBody);
      sendMail("woof@doggyduty.pet", subject, emailBody);
    } else {
      logger.info("Job Execution Log", {
        job_name: "Event Scheduler",
        job_type: "Scheduler",
        status: "Scheduler Stopped",
        error_message: `No scheduled services for today`,
      });
    }
  } catch (error) {
    logger.error(`Error occurred on SMS: ${error.message}`, {
      stack: error.stack,
    });
  }
};
const generateTaskListEmailBody = async (eventList, itemsList) => {
  let emailBody = "";
  if (eventList.length && eventList.length > 0) {
    emailBody = `
      <h2>Daily Task List</h2>
      <p>Dear Team,</p>
      <p>Please find below the Event list for today:</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Event Name</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Community Name</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Address</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Phone</th>
          </tr>
        </thead>
        <tbody>
    `;

    eventList.forEach((event) => {
      emailBody += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${event.title}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${event.communityName}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${event.communityAddress}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${event.phone}</td>
        </tr>
      `;
    });
    emailBody += `
      </tbody>
    </table>

    <p>Items required today:</p>
      <table style="width: 60%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;text-align:left">Item Name</th>
            <th style="border: 1px solid #ddd; padding: 8px;text-align:left">Used</th>
            <th style="border: 1px solid #ddd; padding: 8px;text-align:left">Required</th>
          </tr>
        </thead>
        <tbody>
  `;
    if (itemsList.length && itemsList.length > 0) {
        itemsList.forEach((item) => {
        emailBody += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.itemName}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.requiredQuantity} ${item.unitType}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.usedQuantity} ${item.unitType}</td>
        </tr>
      `;
      });
    }

    emailBody += `
        </tbody>
      </table>

      <p>Thank you!</p>
      <p>Best regards,<br>Holiday Decor Office</p>
    `;
  }
  return emailBody;
};
