#### formdata 上传文件
```javascript
    const express = require('express');
    const bodyParser = require('body-parser');
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

#### node cors 跨域设置
```javascript
    // request
    server.post('/api', (req, res) => {
        if (req.headers['origin'] == 'null' || req.headers['origin'].startsWith('http://localhost')) {
            res.setHeader('Access-Control-Allow-Origin', '*');
        }

        console.log(req.files);
        res.send('upload file successed');
    })

```