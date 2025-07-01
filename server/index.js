import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/index.js'; // Adjust the path as necessary
import env from 'dotenv';

env.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use('/api', routes); // Use the routes defined in the routes directory

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});