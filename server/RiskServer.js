
const risk = require('express')();
//const path = require('path');
const server = require('http').createServer(risk);
const socket = require('socket.io')(server);
const fs = require('fs');


//risk.use(express.static(__dirname + '/node_modules'));

risk.get('/', (req, res) => {
    console.log('we in here');
    res.writeHead(200, {"Content-type" : "text/css"});
    let fileContents = fs.readFileSync('../css/login.css', {encoding: "utf8"});
    res.write(fileContents);
    res.end();
});

socket.on('connection', (data) =>{
    console.log('client connected');
});


server.listen(63334);
console.log('listening on port 63334');