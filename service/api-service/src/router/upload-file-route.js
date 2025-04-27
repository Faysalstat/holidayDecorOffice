const express = require('express');
const router = express.Router();
const uploadController = require('../controller/upload-file-controller');
const upload = require('../middlewares/upload.middleware'); // Import multer from middlewares

// Route
router.post('/upload', upload.single('file'), uploadController.uploadImage);
router.delete('/delete',uploadController.deleteImage);

module.exports = router;
