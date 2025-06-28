import express from 'express';
import upload from '../middleware/file-upload.js'; // Adjust the path as necessary
import fileQueue from '../queue/producer.js';

const router = express.Router();

router.post('/upload/pdf', upload.single('pdf'), fileQueue);

export default router;