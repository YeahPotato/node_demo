### node 使用mysql

`密码签名`   `gzip压缩`  `文件读取流`

```javascript
const http = require('http');
const mysql = require('mysql');
const fs = require('fs');
const url = require('url');
const zlib = require('zlib');
const crypto = require('crypto');

const _key = "rtyuiopkjhgfvcxcvbnmnjhgfdwsasdfghjklpoiuytredcvbnhjuytrewsxcftyujkiuhgfxsedrtyuijhgfd";
function md5(str) {
    let obj = crypto.createHash('md5');
    obj.update(str);
    return obj.digest('hex');
}
function md5_2(str) {
    return md5(md5(str) + _key)
}
let DB_OPTIONS = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "demo"
}
// connect db
let db = mysql.createPool(DB_OPTIONS);


let server = http.createServer((req, res) => {
    let { pathname, query } = url.parse(req.url, true);
    let { username, password } = query;
    console.log(username, password)
    switch (pathname) {
        case '/reg':
            if (!username) {
                res.write('{ "err": 1, "msg": "sername can\'t be null" }');
                res.end();
            } else if (!password) {
                res.write('{ "err": 1, "msg":  "password can\'t be null" }');
                res.end();
            } else if (!/^\w{6,12}$/.test(username)) {
                res.write('{ "err": 1, "msg":  "username is invaild" }');
                res.end();
            } else if (/['|"]/g.test(password)) {
                res.write('{ "err": 1, "msg":  "password is invaild" }');
                res.end();
            } else {
                db.query(`SELECT * FROM user_table WHERE username='${username}'`, (err, data) => {
                    console.log(err, data);
                    if (err) {
                        res.write('{ "err": 1, "msg":  "server error" }');
                        res.end();
                    } else {
                        if (data.length > 0) {
                            res.write('{ "err": 1, "msg":  "this username exsits" }');
                            res.end();
                        } else {
                            db.query(`INSERT INTO user_table (ID,username,password) VALUES(0,'${username}','${md5_2(password)}')`, (err, data) => {
                                if (err) {
                                    res.write('{ "err": 1, "msg":  "server error" }');
                                    res.end();
                                } else {
                                    res.write('{ "err": 1, "msg":  "success" }');
                                    res.end();
                                }
                            })
                        }
                    }
                })
            }
            break;
        case '/login':
            if (!username) {
                res.write('{ "err": 1, "msg":  "username can\'t be null" }');
                res.end();
            } else if (!password) {
                res.write('{ "err": 1, "msg":  "password can\'t be null" }');
                res.end();
            } else if (!/^\w{6,12}$/.test(username)) {
                res.write('{ "err": 1, "msg":  "username is invaild" }');
                res.end();
            } else if (/['|"]/g.test(password)) {
                res.write('{ "err": 1, "msg":  "password is invaild" }');
                res.end();
            } else {
                db.query(`SELECT * FROM user_table WHERE username='${username}'`, (err, data) => {
                    if (err) {
                        res.write('{ "err": 1, "msg":  "server error" }');
                        res.end();
                    } else {
                        if (data.length == 0) {
                            res.write('{ "err": 1, "msg":  "no this user" }');
                            res.end();
                        } else if (data[0].password != md5_2(password)) {
                            res.write('{ "err": 1, "msg":  "username or password is incorrent" }');
                            res.end();
                        } else {
                            res.write('{ "err": 1, "msg":  "login success" }');
                            res.end();
                        }
                    }
                })
            }
            break;
        default:
            let gz = zlib.createGzip();
            let rs = fs.createReadStream(`www${pathname}`);

            res.setHeader('content-encoding', 'gzip');
            rs.pipe(gz).pipe(res);

            rs.on('error', (err) => {
                res.writeHeader(404);
                res.write('Not Found');
                res.end();
            })
    }
});

server.listen(8088);
```