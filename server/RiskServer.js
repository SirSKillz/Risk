const http    = require('http');
const url     = require('url');
const fs      = require('fs');
const SQL   = require('sqlite3');


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
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<h1>Hello! Try the <a href="/login.html">Test page</a></h1>');
            res.end();
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

function send404(res) {
    res.writeHead(404);
    res.write('404');
    res.end()
}

server.listen(8001);

// use socket.io
let io = require('socket.io').listen(server);

// define interactions with client
io.sockets.on('connection', function(socket){
    console.log("New user!");
    //send data to client
    setInterval(function(){
        socket.emit('date', {'date': new Date()});
    }, 1000);

    socket.on('login', function (username, password) {
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

    socket.on('room', function() {
        console.log('joining game 1');
        socket.join('game 1');
    });

    socket.on('start', function() {
        socket.to('game 1').emit('start', 4);
    })
});
