const http = require('http');
const fs = require('fs');
const url = require('url');

let server = http.createServer((req, res) => {
    let { pathname } = url.parse(req.url);

    let rs = fs.createReadStream(`www${pathname}`);
    rs.pipe(res);
    rs.on('error', err);

    function err() {
        res.writeHeader(404);
        res.write('Not Found');
        res.end();
    }
}).listen(8088)