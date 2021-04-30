import express from 'express';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(`${port} working`);
});

app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});