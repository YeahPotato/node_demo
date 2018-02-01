### node设置缓存 和 服务端gzip压缩

#### node缓存
- 需要判断请求头有没有`if-modified-since` 没有就表示初次向服务器请求，服务器需要返回`last-modified`头信息
- 客户端如果有`if-modified-since`头信息,就表示服务端返回过，下面需要判断服务端和客户端的文件修改日期
- 客户端的修改时间小于服务端 服务端就需要返回新的文件 并更新`last-modified`头信息
- 如果客户端是最新的文件 服务端直接返回`304` `Not Modified`

#### gzip压缩
- 创建一个输出流，先`pipe gz` 然后`pipe`到客户端
- 设置`content-ecoding`头信息，浏览器会自动解包


```javascript
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
```