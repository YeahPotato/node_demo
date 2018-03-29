### `node`全栈实践

#### 目录

<details>
  <summary>http</summary>
  
  ##### 模块:`http`,`fs`,`url`
  ###### `http`:用于创建http服务
  ```javascript
  let server = http.createServer((req,res)=>{
      // TODO
  }).listen(8080)
  ```
  ###### `fs`:用于服务端文件操作
  ```javascript
  fs.readFile(path,(err,data)=>{
      // TODO
  })

  fs.writeFile(path);
  
  // 创建读取流
  let reads = fs.createReadStream(path);

  // 创建写入流
  let writes = fs.createWriteStream(path);

  // 用pipe连接流
  reads.pipe(writes);

  // 错误监听
  reads.on('error',(err)=>{});
  writes.on('error',(err)=>{});
  ```

  ###### `url`:url 解析
  ```javascript
  // 解析url返回一个对象
  let url = url.parse(req.url,Boolean);
  // Boolean 默认为false
  // true 返回的url对象中，query的属性为一个对象
  let url = url.parse(req.url,true);
  
  // ex
  let {pathname,query} = url.parse(req.url,true);
  ```

</details>

<details>
  <summary>post_get</summary>
  
  ##### 模块:`querystring`
  ###### `querystring`:一般用来解析post参数
  ###### `url`：解析get参数
  ```javascript
  let resArr = [];
  res.on('data',(data)=>{
      resArr.push(data);
  });

  res.on('end',()=>{
      let post = querystring.parse(resArr);
      console.log(post);
  });
  ```
  
</details>

<details>
  <summary>node_login_or_reg</summary>
  
  ##### 目前只是通过判断`pathname`来判断，客户端是请求接口还是文件，后面会用到路由；
  
</details>


<details>
  <summary>stream</summary>
  
  ##### 流操作，见`http`栏
  ##### `node` 中`request`，`response`本身也是流的一种
  
</details>


<details>
  <summary>node_cache</summary>
  
  ##### 模块:`zlib`
  
  ##### node缓存
  - 需要判断请求头有没有`if-modified-since` 没有就表示初次向服务器请求，服务器需要返回`last-modified`头信息
  - 客户端如果有`if-modified-since`头信息,就表示服务端返回过，下面需要判断服务端和客户端的文件修改日期
  - 客户端的修改时间小于服务端 服务端就需要返回新的文件 并更新`last-modified`头信息
  - 如果客户端是最新的文件 服务端直接返回`304` `Not Modified`

  ##### gzip压缩
  - 创建一个输出流，先`pipe gz` 然后`pipe`到客户端
  - 设置`content-ecoding`头信息，浏览器会自动解包

  ###### `zlib`:服务端压缩
  ```javascript
  let gz = zlib.createGzip();
  reads.pipe(gz).pipe(writes);
  ```
</details>

<details>
  <summary>buffer</summary>
  
  ##### 模块:`uuid(第三方)`
  ##### `uuid`:资源命名
  <hr>

  ##### 实现buffer的split方法

  ```javascript
  Buffer.prototype.split=Buffer.prototype.split||function (b){
    let arr=[];

    let cur=0;
    let n=0;
    while((n=this.indexOf(b, cur))!=-1){
      arr.push(this.slice(cur, n));
      cur=n+b.length;
    }

    arr.push(this.slice(cur));

    return arr;
  };

  ```
  详见buffer
  
</details>

<details>
  <summary>mysql</summary>
  
  ##### 模块：`mysql`,`crypto`
  ##### `mysql`:数据库操作
  ```javascript
  let DB_OPTIONS = {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "",
      database: "demo"
  }
  // connect db
  let db = mysql.createPool(DB_OPTIONS);

  // 查询
  db.query('SELECT * FROM user_table WHERE ID=1',(err,data)=>{
      // TODO
  })
  ```
  ##### `crypto`:签名算法
  ```javascript
  const md5 = (str)=>{
    let obj = crypto.createHash('md5');
    obj.update(str);
    return obj.digest('hex');
  }

  ```
  
</details>

<details>
  <summary>socket</summary>
  
  ##### 模块：`socket.io`
  ##### `socket.io`:socket连接

  - `socket.io` 依赖于http服务，需要监听一个httpserver
  ```javascript
    // client events: 'connect' 'disconnect' 'emit' 'on'
    // server events: 'connection' 'disconnect' 'emit' 'on'

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
  
</details>

<details>
  <summary>formData_express_cors</summary>
  
  ##### 模块：`express`
  ##### node 框架

  - `express` 用express开启服务和midware的使用
  ```html
    <body>
        <input id="file" type="file">
        <input id="btn" type="button" value="提交">
        <script>
            window.onload = function () {
                let oBtn = document.querySelector('#btn');
                let oFile = document.querySelector('#file');

                oBtn.onclick = function () {
                    let oData = new FormData();
                    oData.append('file', oFile.files[0]);

                    let oAjax = new XMLHttpRequest();
                    oAjax.open('POST', 'http://localhost:8086/api', true);
                    oAjax.send(oData);

                    oAjax.onreadystatechange = function () {
                        if (oAjax.readyState === 4) {
                            if (oAjax.status >= 200 && oAjax.status < 300 || oAjax.status == 304) {
                                alert(`success:${oAjax.responseText}`)
                            } else {
                                alert(`error:${oAjax.responseText}`)
                            }
                        }
                    }
                };
            };
        </script>
    </body>
  ```
  ```javascript
    const express = require('express');
    // 解析post数据
    const bodyParser = require('body-parser');
    // 解析post文件数据
    const multer = require('multer');

    let server = express();
    server.listen(8086);

    let multerObj = multer({dest:'./upload/'}); 

    server.use(bodyParser.urlencoded({extended:false}));
    server.use(multerObj.any());
    server.use(express.static('./www/'));


    // request
    server.post('/api',(req,res)=>{
        console.log(req.files);
        res.send('upload file successed');
    })

  ```
  
</details>

<details>
  <summary>Express Server</summary>
  
  ##### 模块：`express`
  ##### node 框架

  - `express` 用express开启服务和midware的使用

  ```javascript
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

  ```
  
</details>