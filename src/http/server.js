const http = require('http');
const fs = require('fs');
const url = require('url');

let server = http.createServer((req, res) => {
    let { pathname } = url.parse(req.url);
    fs.readFile(`www${pathname}`, (err, data) => {
        if (err) {
            res.writeHeader(404);
            res.write('Not Found');
        } else {
            res.write(data);
        }
        res.end();
    })
}).listen(8088);