### 用node开一个http服务，并输出静态文件

**/www下 `server.js`**

```javascript 
const http = require('http');
const fs = require('fs');
const url = require('url');

let server = http.createServer((req, res) => {
    // 解析url
    let { pathname } = url.parse(req.url);
    // 读取文件，返回文件
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

```
