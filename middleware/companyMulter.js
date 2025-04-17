const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/companies');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + unique + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max per file
});

// For company registration: logo, panDocument, gstDocument (single), directorCertificates (array)
const companyUpload = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'panDocument', maxCount: 1 },
  { name: 'gstDocument', maxCount: 1 },
  { name: 'directorCertificates', maxCount: 10 },
]);

module.exports = companyUpload;
