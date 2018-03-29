const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const crypto = require('crypto');

let server = express();
server.listen(8087);

let DB_OPTIONS = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "demo"
}
// connect db
let db = mysql.createPool(DB_OPTIONS);

server.use(bodyParser.urlencoded({}));
// reg
//1.校验数据
server.get('/reg', (req, res, next) => {
    let { user, pass } = req.query;
    if (!user || !/^\w{6,32}$/.test(user)) {
        res.send({ err: 1, msg: "用户名非法" })
    } else if (!/^.{6,}$/.test(pass)) {
        res.send({ err: 1, msg: "密码6-32位" })
    } else {
        next();
    }
});

//2.是否存在
server.get('/reg', (req, res, next) => {
    let { user, pass } = req.query;
    db.query(`SELECT * FROM user_table WHERE user='${user}'`, (err, data) => {
        if (err) {
            res.send({ err: 1, msg: "服务器错误" });
        } else if (data.length) {
            res.send({ err: 1, msg: "用户名重复" });
        } else {
            next();
        }
    })
});

//3.加密
server.get('/reg', (req, res, next) => {
    let { user, pass } = req.query;

    let md5 = crypto.createHash('md5');
    md5.update(pass);
    let _pass = md5.digest('hex');
    req._pass = _pass;
    next();
});
//4.入库
server.get('/reg', (req, res, next) => {
    let { user, pass } = req.query;
    let _pass = req._pass;
    // uuid
    let ID = uuid().replace(/\-/g, '');

    db.query(`INSERT INTO user_table (ID ,user,pass) VALUES('${ID}','${user}','${_pass}')`, (err, data) => {
        if (err) {
            res.send({ err: 1, msg: "服务器错误" });
        } else {
            res.send({ err: 0, msg: "注册成功" });
        }
    })
});
// post test
server.post('/login',(req,res,next)=>{
    console.log(req.query);
    res.send({err:0,msg:"success"});
});

server.use(express.static('./www'));