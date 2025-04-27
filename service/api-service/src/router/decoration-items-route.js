const express = require('express');
const router = express.Router();
const decorationItemController = require('../controller/decorationItem-controller')


router.post('/create',decorationItemController.addDecorationItem);
router.get('/getall',decorationItemController.getAllDecorationItem);
router.get('/get/:id',decorationItemController.getDecorationItemById);
router.post('/update',decorationItemController.updateDecorationItem);
router.delete('/delete',decorationItemController.deleteDecorationItem);
module.exports = router