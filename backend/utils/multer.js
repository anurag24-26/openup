const multer = require("multer");

const storage = multer.memoryStorage(); // Store in memory for direct Cloudinary upload
const upload = multer({ storage });

module.exports = upload;
