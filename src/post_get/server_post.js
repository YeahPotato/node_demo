const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

let server = http.createServer((req, res) => {
    let { pathname } = url.parse(req.url, true);
    // post
    let str = '';

    req.on('data', data => {
        str += data;
    });

    req.on('end', () => {
        let post = querystring.parse(str);
        console.log(post);
        if (pathname.indexOf('.html') != -1) {
            let rs = fs.createReadStream(`www${pathname}`);
            rs.pipe(res);
            rs.on('error', err => {
                res.writeHeader(404);
                res.write('Not Found');
            })
        } else {
            res.write(`successed: username:${post.username},password:${post.pass}`);
            res.end();
        }
    });


}).listen(8088);