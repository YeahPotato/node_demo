const http = require('http');
const common = require('./extend/split');
const uuid = require('uuid/v4');
const fs = require('fs');

let server = http.createServer((req, res) => {
    let arr = [];
    req.on('data', data => {
        arr.push(data);
    });


    req.on('end', () => {
        let data = Buffer.concat(arr);
        let post = {};
        let files = {};
        if (req.headers['content-type']) {
            let boundary = '--' + req.headers['content-type'].split('; ')[1].split('=')[1];
            // 用分割符切开数据
            let arr = data.split(boundary);
            // 删掉头尾元素
            arr.shift();
            arr.pop();
            // 丢弃每一项的头尾\r\n
            arr = arr.map(buffer => buffer.slice(2, buffer.length - 2));
            // 每个数据在第一个"\r\n\r\n"处切成两半
            arr.forEach(buffer => {
                let n = buffer.indexOf('\r\n\r\n');
                let desc = buffer.slice(0, n);
                let content = buffer.slice(n + 4);
                desc = desc.toString();
                if (desc.indexOf('\r\n') != -1) {
                    // 文件数据
                    let [desc1, desc2] = desc.split('\r\n');
                    let [, name, filename] = desc1.split('; ');
                    let type = desc2.split(': ')[1];
                    name = name.split('=')[1];
                    name = name.substring(1, name.length - 1);

                    filename = filename.split('=')[1];
                    filename = filename.substring(1, filename.length - 1);

                    let path = `upload/${uuid().replace(/\-/g, '')}`;

                    fs.writeFile(path, content, err => {
                        if (err) {
                            console.log('文件写入失败'+err);
                            res.writeHeader(500);
                            res.write('文件写入失败');
                            res.end();
                        } else {
                            files[name] = { filename, path, type };
                        }
                    })
                } else {
                    // 普通数据
                    content = content.toString();
                    let name = desc.split('; ')[1].split('=')[1];
                    name = name.substring(1, name.length - 1);
                    post[name] = content;
                }
            })
            console.log(post)
        }else{
            res.end();
        }
    });
}).listen(8088);