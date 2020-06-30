const helper = require('./functions/helper');
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');
const http = require('http');
const serveIndex = require('serve-index');
const fileUpload = require('express-fileupload');
const moment = require('moment');
const fs = require('fs');
const app = express();
const directoryRoot = path.join('./', 'Clases');

let httpServer = http.createServer(app);

let videoRegExp = /\.(mp4|mkv|webm)$/;
let docRegExp = /\.(pdf|json|xml|txt|doc|docx|md|css|js)$/;
let otherRegExp = /[a-zA-Z0-9]$/;
let photoRegExp = /\.(jpg|jpeg|png|gif)$/;


app.use(cors());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/Clases', express.static(__dirname + "/Clases"));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://cloud.colegiocruzdelsur.cl"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// app.get('/Clases/:uid/', (req, res, next) => {
//     const uid = req.params.uid;
//     console.log(uid);
// });

app.post('/initFolder', (req, res) => {
    const uid = req.body.uid;
    const directoryPath = path.join(`./`, 'Clases');
    if(fs.existsSync(`${directoryPath}/${uid}`))
        res.send({result: `${directoryPath}/${uid}`})
    else {
        helper.CreatingDirectory(uid);
        console.log('directory not found', `${directoryPath}/${uid}`)
        res.send({result:'error'});
    }
});
app.post('/createSubFolder', (req, res) => {
    const uid = req.body.uid;
    const tag = req.body.tag;
    const directoryPath = path.join(`./`, 'Clases');
    if(fs.existsSync(`${directoryPath}/${uid}/${tag}`))
        res.send({result: `${directoryPath}/${uid}/${tag}`})
    else {
        helper.CreatingSubDirectory(tag, uid);
        console.log('Sub-directory not found', `${directoryPath}/${uid}/${tag}`)
        res.send({result:'error'});
    }
});
app.post('/imagenes', (req, res) => {
    const uid = req.body.uid;
    const dir_name = req.body.dir_name;
    let dir_stat = helper.retrieveFiles(req, res, uid, dir_name, 'imagenes', photoRegExp);
    dir_stat.then(response => res.send(response))
});
app.post('/videos', (req, res) => {
    const uid = req.body.uid;
    const dir_name = req.body.dir_name;
    let dir_stat = helper.retrieveFiles(req, res, uid, dir_name, 'videos', videoRegExp);
    dir_stat.then(response => res.send(response))
});
app.post('/documentos', (req, res) => {
    const uid = req.body.uid;
    const dir_name = req.body.dir_name;
    let dir_stat = helper.retrieveFiles(req, res, uid, dir_name, 'documentos', docRegExp);
    dir_stat.then(response => res.send(response))
});
app.post('/otros', (req, res) => {
    const uid = req.body.uid;
    const dir_name = req.body.dir_name;
    let dir_stat = helper.retrieveFiles(req, res, uid, dir_name, 'otros', otherRegExp);
    dir_stat.then(response => res.send(response))
});

//Upload files
app.post('/upload', (req, res) => {
    const uid = req.body.uid;
    const path = req.body.dir_name;
    if(req.files === null){
        return res.status(400).json({msg: 'No ha subido ningún archivo'});
    }
    const file = req.files.file;
    console.log(file);
    file.mv(`${directoryRoot}/${uid}/${path}/${file.name}`, err => {
        if(err){
            console.error(err);
            return res.status(500).send(err);
        }
        console.log(`${file.name} subido con éxito!`);
        res.json({fileName: file.name, filePath: `/${uid}/${path}/${file.name}`})
    });
});

if(require.main === module){
    var server = app.listen(9000, () => {
    
        var host = server.address().address
        var port = server.address().port
    
        console.log("Example app listening at http://%s:%s", host, port)
    
    });
}