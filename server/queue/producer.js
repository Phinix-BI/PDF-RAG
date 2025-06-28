import Queue from './queue.js';

const fileQueue = async (req,res) => {

    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const job = await Queue.add('pdf-job', JSON.stringify({
        filename: file.filename,
        originalname: file.originalname,
        size: file.size,
        path: file.path
    }));

    res.status(201).json({ jobId: job.id });
};

export default fileQueue;