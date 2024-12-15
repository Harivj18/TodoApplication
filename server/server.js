const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const nano = require('nano');
const oracle = require('oracledb');
const port = 8080;
const cors = require('cors');
const routes = require('./router');
const cookies = require('cookie-parser');
const socketConnection = require('./socket');


app.use(bodyparser.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use('/',routes);
app.use(cookies())



const server = app.listen(port, (err) => {
    if (err) {
        console.log(`Error While Starting Server on Port ${port}`, err);
    } else {
        socketConnection(server); // Pass the server instance to the socket connection
        console.log(`Server is Listening on Port ${port}`);
    }
});