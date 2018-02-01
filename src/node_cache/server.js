const http = require('http');
const fs = require('fs');
const url = require('url');
const zlib = require('zlib');

let server = http.createServer((req, res) => {
    let { pathname, query } = url.parse(req.url, true);

    fs.stat(`www${pathname}`, (err, stats) => {
        if (err) {
            res.writeHeader(404);
            res.write('Not Found');
            res.end();
        } else {
            if (req.headers['if-modified-since']) {
                // 服务端发送过   Last-Modified
                let clientTime = Math.floor((new Date(req.headers['if-modified-since']).getTime()) / 1000);
                let serverTime = Math.floor((stats.mtime.getTime()) / 1000);
                if (clientTime < serverTime) {
                    // 文件旧  返回新文件
                    sendClient();
                } else {
                    res.writeHeader(304);
                    res.write('Not Modified');
                    res.end();
                }
            } else {
                sendClient();
            }
        }

        function sendClient() {
            let rs = fs.createReadStream(`www${pathname}`);
            let gz = zlib.createGzip();

            res.setHeader('Content-Encoding', 'gzip');
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Last-Modified', stats.mtime.toGMTString());

            rs.pipe(gz).pipe(res);

            rs.on('error', (err) => {
                res.writeHeader(404);
                res.write('Not Found');
                res.end();
            });
        }
    });



});

server.listen(8088);