const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create directories if they don't exist
const createFolderIfNotExists = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

createFolderIfNotExists(path.join(__dirname, '../uploads/pdfs'));
createFolderIfNotExists(path.join(__dirname, '../uploads/images'));
createFolderIfNotExists(path.join(__dirname, '../uploads/audios'));
createFolderIfNotExists(path.join(__dirname, '../uploads/docs'));

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = '';
    if (file.mimetype === 'application/pdf') {
      folder = './uploads/pdfs/';
    } else if (file.mimetype.startsWith('image/')) {
      folder = './uploads/images/';
    } else if (file.mimetype.startsWith('audio/')) {
      folder = './uploads/audios/';
    } else if (file.mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document') || // .docx
               file.mimetype.startsWith('application/msword')) { // .doc
      folder = './uploads/docs/';
    } else {
      return cb(new Error('Invalid file type'), false);
    }
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

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
