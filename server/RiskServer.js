//let server = require('express')();
let http = require('http');
//let io = require('socket.io')(http);
let url = require('url');
let fs = require('fs');


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

    //recieve client data
    socket.on('client_data', function(data){
        process.stdout.write(data.letter);
    });
});