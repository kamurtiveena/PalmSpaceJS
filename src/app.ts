import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const HOST = process.env.HOST || `localhost.com`;
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(`${PORT} working`);
});

app.listen(PORT, () => {
    return console.log(`server is listening on ${PORT}`);
});