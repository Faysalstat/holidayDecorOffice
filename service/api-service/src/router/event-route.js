const express = require('express');
const router = express.Router();
const eventScheduleController = require('../controller/event-schedule-controller')


router.post('/create',eventScheduleController.addEventSchedule);
router.get('/getall',eventScheduleController.getAllEventSchedule);
router.get('/getsummary',eventScheduleController.getSummary);
router.get('/getbyid',eventScheduleController.getEventScheduleById);
router.post('/update',eventScheduleController.updateEventSchedule);
router.post('/item/update',eventScheduleController.updateItemMapping);
router.post('/complete',eventScheduleController.completeEvent);
router.delete('/delete',eventScheduleController.deleteEventSchedule);
module.exports = router