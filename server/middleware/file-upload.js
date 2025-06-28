import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        const uniqueName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    console.log('File received:', file.originalname, 'Type:', file.mimetype);
    
    // Only accept PDF files
    if (file.mimetype === 'application/pdf') {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.pdf') {
            cb(null, true);
        } else {
            cb(new Error('File extension does not match PDF mime type'));
        }
    } else {
        cb(new Error('Error: Only PDF files are allowed!'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 10 }, // 10MB file size limit
    fileFilter,
});

export default upload;