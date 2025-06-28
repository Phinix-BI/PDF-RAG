import { Queue } from 'bullmq';

const queue = new Queue('pdf-queue', {
    connection: {
        host: 'localhost', // Adjust if your Redis server is hosted elsewhere
        port: 6379, // Default Redis port
    }
});

export default queue;