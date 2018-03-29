const express = require('express');
const body = require('body-parser');

// server
let server = express();
server.listen(8086);

// midware
server.use(body.urlencoded({extended:false}));

// request
server.post('/api', (req, res) => {
    console.log(req.body);
    res.send({'error':0,'msg':'success'});
})

// static resource
server.use(express.static('./www/'))