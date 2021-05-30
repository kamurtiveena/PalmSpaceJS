import express from 'express';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';

dotenv.config();

const app = express();
const HOST = process.env.HOST || `localhost`;
const PORT = parseInt(process.env.PORT || "3000");
const NODE_ENV = process.env.NODE_ENV || "development";

console.group("environment");
//console.table(process.env);
console.table({HOST, PORT, NODE_ENV});
console.groupEnd();



app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(`${PORT} working`);
});

// todo add middleware to print request host




if (NODE_ENV == "production") {
    const SSL_KEY = process.env.SSL_KEY || "";
    const SSL_CERT = process.env.SSL_CERT || "";

    console.group("ssl");
    //console.table(process.env);
    console.table({SSL_CERT, SSL_KEY});
    console.groupEnd();
    
    https.createServer({
    key: fs.readFileSync(SSL_KEY),
    cert: fs.readFileSync(SSL_CERT)
    }, app)
    .listen(PORT, function() { 
        return console.log(`server is listening on ${PORT}`);
    });
} else {
    app.listen(PORT, HOST, () => {
        return console.log(`server is listening on ${PORT}`);
    });
}
