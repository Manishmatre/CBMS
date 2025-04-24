import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword', // DOC
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOCX
];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

export default upload;
