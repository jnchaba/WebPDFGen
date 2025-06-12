import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// File filter to accept only HTML files
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype === 'text/html' || path.extname(file.originalname).toLowerCase() === '.html') {
    cb(null, true);
  } else {
    cb(new Error('Only HTML files are allowed!'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file at a time
  }
});

// Error handling middleware for multer
export const handleMulterError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size must be less than 5MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        message: 'Only one file can be uploaded at a time'
      });
    }
  }
  
  if (error.message === 'Only HTML files are allowed!') {
    return res.status(400).json({
      error: 'Invalid file type',
      message: 'Only HTML files are allowed'
    });
  }

  return res.status(500).json({
    error: 'Upload failed',
    message: error.message || 'Unknown upload error'
  });
};