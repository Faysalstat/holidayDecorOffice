const fs = require("fs");
const path = require("path");
exports.handleImageUpload = async (file) => {
    try {
      // Any extra processing if needed
      return {
        message: 'Image uploaded successfully!',
        filename: file.filename,
        path: `/uploads/${file.filename}`
      };
    } catch (error) {
      throw new Error('Error handling file upload');
    }
  };

  exports.deleteImage = async (filename) => {
    try {
      
      const filepath = path.join(__dirname, "../../uploads", filename);
  
      fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
         return "File not found";
        }
  
        fs.unlink(filepath, (unlinkErr) => {
          if (unlinkErr) {
            throw new Error("Error deleting file" );
          }
          return "File deleted successfully";
        });
      });
    } catch (error) {
      throw new Error(error.message)
    }
  };
  