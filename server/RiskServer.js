const http    = require('http');
const url     = require('url');
const fs      = require('fs');
const SQL   = require('sqlite3');
const Game = require('../js/Game.js');



global["database"] = new SQL.Database("./database.db", function (err) {
    if (err) {
        console.error(err.message);
    } else {
        // Create Login table
        let createLoginSql = "CREATE TABLE IF NOT EXISTS login(username TEXT PRIMARY KEY, password TEXT)";
        database.run(createLoginSql);
        console.log("Database was successfully opened!");
    }
});

server = http.createServer(function(req, res){
    // your normal server code
    let path = url.parse(req.url).pathname;
    //console.log("Old path " + path);
    let pathTemp = path.substr(0,2);
    //console.log("New path " + pathTemp);
    switch (pathTemp) {
        case '/':
            fs.readFile('../index.html', function (err, data) {
                if(err){
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type' : 'text/html'});
                res.write(data, 'utf8');
                res.end();
            });
            break;
        case '/c':
            // Should be a CSS file
            fs.readFile('..' + path, function (err, data) {
                if(err){
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type' : 'text/css'});
                res.write(data, 'utf8');
                res.end();
            });
            break;
        case '/i':
            // Should be a png
            fs.readFile('..' + path, function (err, data) {
                if(err){
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type' : 'image/png'});
                res.write(data, 'utf8');
                res.end();
            });
            break;
        case '/j':
            fs.readFile('..' + path, function (err, data) {
                if(err){
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type' : 'text/javascript'});
                res.write(data, 'utf8');
                res.end();
            });
            break;
        default:
            // Not a CSS, JS, or IMG file
            fs.readFile('..' + path, function(err, data){
                if (err){
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': path === 'json.js' ? 'text/javascript' : 'text/html'});
                res.write(data, 'utf8');
                res.end();
            });
            break;
    }
});

// Send 404 page if the actual page failed to load
function send404(res) {
    fs.readFile('../404.html', function(err, data){
        if (err){
            return send404(res);
        }
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(data, 'utf8');
        res.end();
    });
}

server.listen(8001);

// use socket.io
let io = require('socket.io').listen(server);
let game1 = [];
let currentLobby;
let count = 0;
let loggedInUsers = [];
let createGame = false;
let roomArray = [];
let roomNum = 1;
let numPlayers = 0;


function getRoom(user){
    for (let i = 0; i<roomArray.length; i++){
        if(roomArray[i].isInRoom(user)){
            return roomArray[i].getRoomName();
        }
    }
    return 'not found';
}

function getGame(roomName){
    for (let i = 0; i<roomArray.length; i++){
        if(roomName === roomArray[i].getRoomName()){
            return roomArray[i];
        }
    }
    return 'not found';
}

// define interactions with client
io.sockets.on('connection', function(socket){
    console.log("New user!");
    //send data to client

    socket.on('login', function (username, password) {
        console.log('logging in');
        let sql = "SELECT * FROM login WHERE username = ?";
        database.get(sql, username, function (err, user) {
            if (err) {
                console.error(err.message);
                socket.emit('badLogin');
            } else {
                // Check if the user exists and that the password is correct
                if (user && user.password === password) {
                    // The username and password match
                    socket.emit('goodLogin');
                } else {
                    socket.emit('badLogin');
                }
            }
        });
    });

    socket.on('i am lobby', function() {
        console.log('lobby connected');
        currentLobby = socket.id;
        if(loggedInUsers.length !== 0){
            socket.emit('username', loggedInUsers[loggedInUsers.length-1])
        }

    });

    socket.on('socket closed', function () {
        console.log('socket closed');
    });

    // socket.on('get lobby', function() {
    //     console.log('getting new lobby');
    //     socket.emit('get lobby2');
    // });

    socket.on('logged in', function(username, ) {
        //console.log('sending username to lobby');
        //console.log(currentLobby);
        loggedInUsers.push(username);
    });

    socket.on('register', function (username, password) {
        let sql = "INSERT INTO login (username, password) VALUES (?, ?)";
        database.run(sql, [username, password], function (err) {
            if (err) {
                socket.emit('usernameTaken');
                console.warn("Username was taken: " + err);
            } else {
                // If it succeeded, it added a user
                socket.emit('registerSuccess');
                console.log("Registered new user: " + username);
            }
        });
    });

    socket.on('join Request', function(username) {
        for(let i = 0; i<loggedInUsers.length; i++){
            //  console.log('loggedInUsers at i: ' + loggedInUsers[i])
            if(username === loggedInUsers[i]){
                console.log('logged in');
                socket.emit('load risk');
                return;
            }
        }
        socket.emit('not logged in yet');
    });

    socket.on('create game', function(username) {
        console.log(username);
        //console.log(loggedInUsers);
        //console.log(socket.id);
        for(let i = 0; i<loggedInUsers.length; i++){
          //  console.log('loggedInUsers at i: ' + loggedInUsers[i])
            if(username === loggedInUsers[i]){
                console.log('logged in');
                createGame = true;
                socket.emit('load risk');
                return;
            }
        }
        socket.emit('not logged in yet');
    });

    socket.on('room', function() {
        if(createGame) {
            console.log('creating game ' + roomNum);
            socket.join('game ' + roomNum);
            let game = new Game('game ' + roomNum, socket.id, numPlayers, 0);
            roomArray.push(game);
            //game1.push(socket.id);
            createGame = false;
            roomNum++;
            numPlayers = 0;
        } else {
            console.log('joining game...');
            for(let i = 0; i<roomArray.length; i++){
                if(roomArray[i].hasRoom()){
                    socket.join(roomArray[i].getRoomName());
                    roomArray[i].addUser(socket.id);
                    console.log('joining ' + roomArray[i].getRoomName());
                    return;
                }//end if
            }
            console.log('no free game creating new one');
            socket.join('game ' + roomNum);
            let game = new Game('game ' + roomNum, socket.id, 2, 0);
            roomArray.push(game);
            roomNum++;
            //game1.push(socket.id);
        }
    });

    socket.on('number of players', function (num) {
        numPlayers = num;
    });

    socket.on('start', function() {
        let room = getRoom(socket.id);
        socket.to(room).emit('start', 4);
    });

    socket.on('realstart', function(players, remainingArmies) {
        let room = getRoom(socket.id);
        let game = getGame(room);
        socket.to(room).emit('realstart', players, game.getUsers(), remainingArmies);
    });

    socket.on('restart', function() {
        let room = getRoom(socket.id);
        let game = getGame(room);
        socket.to(room).emit('restart');
        socket.disconnect(room);
        game.removeUser(socket.id);
    });

    socket.on('removeFromGame', function(){
        let room = getRoom(socket.id);
        let game = getGame(room);
        socket.disconnect(room);
        game.removeUser(socket.id);
        console.log("dude disconnected")
        //game1 = [];
    });

    socket.on('fortification', function(userTurn, players){
        console.log("Here?")
        let room = getRoom(socket.id);
        let game = getGame(room);
        socket.to(room).emit('fortification', userTurn, players);
        count++;
        console.log(count);
        if(count === game.getUsers().length){
            socket.to(room).emit('fortificationComplete', userTurn, players);
        }
    })

    socket.on('finalInitialFort', function(players){
        let room = getRoom(socket.id);
        socket.to(room).emit('finalInitialFort', players);
       // let game = getGame(room);
        count = 0;
    })

    socket.on('fortifyIndy', function(players){
        let room = getRoom(socket.id);
        socket.to(room).emit('fortifyIndy', players);
    })

    socket.on('successDefense', function(attack, defend){
        console.log(attack);
        let room = getRoom(socket.id);
        socket.to(room).emit('successDefense', attack, defend);
    })

    socket.on('battleInProgress', function(players){
        let room = getRoom(socket.id);
        socket.to(room).emit('battleInProgress', players);
    })

    socket.on('playerElimination', function(eliminated){
        let room = getRoom(socket.id);
        socket.to(room).emit('playerElimination', eliminated);
    })

    socket.on('moveTroops1', function(){
        let room = getRoom(socket.id);
        socket.to(room).emit('moveTroops1');
    })

    socket.on('moveTroopsEnd', function (players, playerTurn){
        console.log(playerTurn);
        let room = getRoom(socket.id);
       socket.to(room).emit('moveTroopsEnd', players, playerTurn);
    });
});
