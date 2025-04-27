const uploadService = require("../service/upload-file-service");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const response = await uploadService.handleImageUpload(req.file);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const filename = req.query.imageName;
    let response = await uploadService.deleteImage(filename);
    return res.status(200).json({
      message: "Image Deleted",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};
