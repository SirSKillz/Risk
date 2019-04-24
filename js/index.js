function joinGame(username) {
    socket.emit('join Request', username);
}

function makeGame(username) {
    socket.emit('create game', username);
}

function closeSocket() {
    socket.emit('socket closed');
    socket.close();
    window.location.href = "login.html";
}