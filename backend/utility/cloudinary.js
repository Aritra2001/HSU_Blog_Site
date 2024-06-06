const multer = require('multer');
const path = require('path');

// Set storage engine to memory storage
const storage = multer.memoryStorage();

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit, adjust as necessary
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).fields([
  { name: 'pdf', maxCount: 1 }, 
  { name: 'image', maxCount: 1 }, 
  { name: 'audio', maxCount: 1 },
  { name: 'doc', maxCount: 1 } // Added doc type
]);

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|pdf|mp3|wav|doc|docx/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: PDFs, Images, Audio Files, and Documents Only!');
  }
}

module.exports = upload;
