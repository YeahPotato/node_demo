## socket.io


```javascript
    const http = require('http');
    const sock = require('socket.io');
    const url = require('url');
    const fs = require('fs');
    const zlib = require('zlib');

    let server = http.createServer((req, res) => {
        let { pathname } = url.parse(req.url);
        let gz = zlib.createGzip();
        let rs = fs.createReadStream(`www${pathname}`);

        res.setHeader('content-encoding', 'gzip');
        rs.pipe(gz).pipe(res);
        rs.on('error', () => {
            res.writeHeader(404);
            res.write('Not Found');
            res.end();
        })

    });
    server.listen(1234);


    let wsServer = sock.listen(server);
    wsServer.on('msg', data => {
        console.log(`收到客户端的消息：${data}`);
    })
    let count = 0;
    setInterval(() => {
        count++;
        wsServer.emit('msg', '我是服务端的消息' + count);
    }, 500)
```