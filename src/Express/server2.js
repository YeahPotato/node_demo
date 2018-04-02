const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

let server = express();
server.listen(8089);

let multerObj = multer({ dest: './upload/' });

server.use(multerObj.any());
server.use(bodyParser.urlencoded({ extended: false }));

server.post('/upload', (req, res, next) => {
    console.log(req.files);
    console.log(req.body);

    // modified file name 
    let i = 0;
    if (!req.files.length) {
        res.send({ 'err': 1, 'msg': '请先上传文件' });
    } else {
        __extendName();
    }

    function __extendName() {
        let newName = req.files[i].path + path.extname(req.files[i].originalname);
        fs.rename(req.files[i].path, newName, err => {
            if (err) {
                res.sendStatus(500, 'rename error');
            } else {
                i++;
                if (i >= req.files.length) {
                    res.send({ 'err': 0, 'msg': 'upload successed' });
                } else {
                    __extendName();
                }
            }
        })
    }
});