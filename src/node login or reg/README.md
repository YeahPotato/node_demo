### node 模拟 用户注册登录

```javascript
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

let users = {
    
};
// user pass {user:xx,pass:123}
let server = http.createServer((req, res) => {
    // get
    let { pathname, query } = url.parse(req.url, true);

    // POST 
    let str = '';
    req.on('data', data => {
        str += data;
    });
    req.on('end', () => {
        let { user, pass } = querystring.parse(str);

        switch (pathname) {
            case '/reg':
                if (!user) {
                    res.write('{"err": 1, "msg": "user is required"}');
                } else if (!pass) {
                    res.write('{"err": 1, "msg": "pass is required"}');
                } else if (!/^\w{8,32}$/.test(user)) {
                    res.write('{"err": 1, "msg": "invaild username"}');
                } else if (/^['|"]$/.test(pass)) {
                    res.write('{"err": 1, "msg": "invaild password"}');
                } else if (users[user]) {
                    res.write('{"err": 1, "msg": "username already exsits"}');
                } else {
                    users[user] = pass;
                    res.write('{"err": 0, "msg": "success"}');
                }
                res.end();
                break;
            case '/login':
                if (!user) {
                    res.write('{"err": 1, "msg": "user is required"}');
                } else if (!pass) {
                    res.write('{"err": 1, "msg": "pass is required"}');
                } else if (!/^\w{8,32}$/.test(user)) {
                    res.write('{"err": 1, "msg": "invaild username"}');
                } else if (/^['|"]$/.test(pass)) {
                    res.write('{"err": 1, "msg": "invaild password"}');
                } else if (!users[user]) {
                    res.write('{"err": 1, "msg": "no this user"}');
                } else if (users[user] != pass) {
                    res.write('{"err": 1, "msg": "username or password is incorrect"}');
                } else {
                    res.write('{"err": 0, "msg": "login success"}');
                }
                res.end();
                break;
            default:
                let rs = fs.createReadStream(`www${pathname}`);
                rs.pipe(res);
                rs.on('error', callError);
        }
    });


    function callError() {
        res.writeHeader(404);
        res.write('Not Found');
    }


}).listen(8088);
```