import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const HOST = process.env.HOST || `localhost`;
const PORT = parseInt(process.env.PORT || "3000");


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(`${PORT} working`);
});

// todo add middleware to print request host

app.listen(PORT, HOST, () => {
    return console.log(`server is listening on ${PORT}`);
});