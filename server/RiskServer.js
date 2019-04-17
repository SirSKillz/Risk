
const http = require('http');

const server = http.createServer((req, res)=> {
    if(req.url == '/') {
        res.write('we in this bitch');
        res.end();
    };
});

server.listen(63334);

console.log('listening on port 3000');