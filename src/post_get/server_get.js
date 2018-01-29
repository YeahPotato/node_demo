const http = require('http');
const fs = require('fs');
const url = require('url');

let server = http.createServer((req, res) => {
    let result = url.parse(req.url,true);
    let { pathname, query } = url.parse(req.url, true);
    console.log(pathname, query);

    if (pathname.indexOf('.html') != -1) {
        let rs = fs.createReadStream(`www${pathname}`);
        rs.pipe(res);
        res.on('error', err => {
            res.writeHeader(404);
            res.write('Not Found');
            res.end();
        })
    }else{
        res.write('success');
        res.end();
    }

}).listen(8088)