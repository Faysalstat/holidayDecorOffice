const decorationItemService = require("../service/decorationItem-service");
exports.addDecorationItem = async (req, res, next) => {
  try {
    let response = await decorationItemService.addDecorationItem(req, res, next);
    return res.status(200).json({
      message: "Decoration Item Created",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};

exports.getAllDecorationItem = async (req, res, next) => {
  try {
    let response = await decorationItemService.getAllItems(req, res, next);
    return res.status(200).json({
      message: "Decoration Item Retrieved",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};
exports.getDecorationItemById = async (req, res, next) => {
  try {
    let params = req.query;
    let response = await decorationItemService.getDecorationItemById(params);
    return res.status(200).json({
      message: "Decoration Item Retrieved",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};  
exports.updateDecorationItem = async (req, res, next) => {
  try {
    let response = await decorationItemService.updateDecorationItem(req, res, next);
    return res.status(200).json({
      message: "Decoration Item Updated",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};
exports.deleteDecorationItem = async (req, res, next) => {
  try {
    let response = await decorationItemService.deleteDecorationItem(req, res, next);
    return res.status(200).json({
      message: "Decoration Item Deleted",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};