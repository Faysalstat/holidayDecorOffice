const notificationService = require("../service/notification-service");

exports.getAllUnreadNotification = async (req, res, next) => {
  try {
    let response = await notificationService.getAllUnreadNotification(req, res, next);
    return res.status(200).json({
      message: "Unread notifications fetched successfully",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    let response = await notificationService.markAsRead(req, res, next);
    return res.status(200).json({
      message: "Notification marked as read",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};
