const io = require('socket.io');

let socket = io('http://localhost:63334');

socket.on('connection', (data) =>{
    console.log("client joined");
});
