const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notification-controller')

router.get('/getall',notificationController.getAllUnreadNotification);
router.post('/read',notificationController.markAsRead);
module.exports = router