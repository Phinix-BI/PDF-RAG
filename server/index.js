import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/index.js'; // Adjust the path as necessary


const app = express();
const port = 5000 || process.env.PORT;

app.use(bodyParser.json());
app.use(cors());
app.use('/api', routes); // Use the routes defined in the routes directory

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});