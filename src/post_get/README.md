## GET/POST

**GET**
- `url` 模块解析请求参数
```javascript
const http = require('http');
const fs = require('fs');
const url = require('url');

let server = http.createServer((req, res) => {
    let result = url.parse(req.url,true);
    let { pathname, query } = url.parse(req.url, true);

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
```
<hr>

**POST**
- `querystring` 模块解析post参数
```javascript
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

```