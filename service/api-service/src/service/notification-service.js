const { Op } = require("sequelize");
const Notification = require("../model/notification");

exports.createNotification = async (content) => {
  try {
    let notificationModel = {
      content: content,
      isViewed: false,
    };
    let response = await Notification.create(notificationModel);
    return response;
  } catch (error) {
    throw new Error("Notification Not Created: " + error.message);
  }
};

exports.markAsRead = async (req) => {
  let body = req.body;
  let ids = body.ids;
  try {
    await Notification.destroy(
      { where: { id: { [Op.in]: ids } } }
    );
    return "Success";
  } catch (error) {
    throw new Error("Notification Not Updated: " + error.message);
  }
};

exports.getAllUnreadNotification = async () => {
  try {
    let response = await Notification.findAll({ where: { isViewed: false } });
    return response;
  } catch (error) {
    throw new Error("Notification Fetching Failed: " + error.message);
  }
};
