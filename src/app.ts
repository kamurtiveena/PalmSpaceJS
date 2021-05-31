import express from 'express';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import createDBPool from './db';

dotenv.config();

const app = express();
const HOST = process.env.HOST || `localhost`;
const PORT = parseInt(process.env.PORT || "3000");
const NODE_ENV = process.env.NODE_ENV || "development";

const dbConfig = {
    host: process.env.DB_host || "localhost",
    port: process.env.DB_port || 3306,
    user: process.env.DB_user || "prantoran",
    pass: process.env.DB_pass || "",
    database: process.env.DB_database || "prantordb"
}
 
console.group("environment");
//console.table(process.env);
console.table({HOST, PORT, NODE_ENV});
console.groupEnd();

console.group("db");
//console.table(process.env);
console.table(dbConfig);
console.groupEnd();

const pool = createDBPool(
    dbConfig.host, 
    dbConfig.user, 
    dbConfig.pass, 
    dbConfig.database);

// console.group("db-pool");
// //console.table(process.env);
// console.table(pool);
// console.groupEnd();


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(`${PORT} working`);
});

// Route to test database connection
app.get('/:tableName', async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()

        let sql = `SELECT * FROM ${req.params.tableName}`
        let result = await conn.query(sql)

        res.send(result)
    } catch (error) {
        throw error
    } finally {
        if (conn) {
            conn.release()
        }
    }
});


app.post('/create/table/:name', async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()

        let sql = `CREATE TABLE ${req.params.name} (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255))`;
        let result = await conn.query(sql);

        res.send(result)
    } catch (error) {
        throw error
    } finally {
        if (conn) {
            conn.release()
        }
    }
})

// todo add middleware to print request host
// todo middleware for error handling

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
