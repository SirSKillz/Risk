
const express = require('express');
//const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

let risk = express();
let server = http.Server(risk);
let sockets = socketIO(server);

risk.get('/', (req, res) => {
    res.write('we in this bitch');
    res.end();
});

server.listen(63334);

console.log('listening on port 63334');