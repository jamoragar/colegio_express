const moment = require('moment');
const fs = require('fs');
const path = require('path');
const util = require('util');
const directoryRoot = path.join('./', 'Clases');

const readdirAsync = util.promisify(fs.readdir);

const API = 'http://localhost:9000';
module.exports = {
    CreatingDirectory: uid =>{
        const userId = uid;
        if(!fs.existsSync(`${directoryRoot}/${userId}`)){
            fs.mkdir(`${directoryRoot}/${userId}`,
            {recursive: true }, (err) => { 
                if (err) { 
                    return console.log(err); 
                } 
                console.log('Directory created successfully!'); 
            });
        }
    },
    CreatingSubDirectory: (sub_dir_name, uid) =>{
        const userId = uid
        if(!fs.existsSync(`${directoryRoot}/${userId}/${sub_dir_name}`)){
            fs.mkdir(`${directoryRoot}/${userId}/${sub_dir_name}`,
            {recursive: true }, (err) => { 
                if (err) { 
                    return console.log(err); 
                } 
                console.log('Sub-directory created successfully!'); 
            });
        }
    },
    retrieveFiles: async (req, res, uid, dir_name, title, regExp) => {
        const userId = uid;
        let targetDir = `${directoryRoot}/${userId}/${dir_name}`;

        try{
            let items = await readdirAsync(targetDir);
            let filteredItems = [];
            if(items !== undefined){
                for(let i = 0; i<items.length; i++){
                    let item = items[i];
                    if(items[i].match(regExp)){
                        filteredItems.push(`${API}/${targetDir}/${item}`);
                    }
                }
            }
            return {
                tag: dir_name,
                title: `${targetDir}/${title}`,
                files: filteredItems,
                uid: uid
            };
        }catch(e){
            console.log(e);
        };
    },
    GetAllFilesFromFolder: dir => {
        let results = [];
        fs.readdirSync(dir).forEach(function(file) {
            file = dir+'/'+file;
            let stat = fs.statSync(file);

            if (stat && stat.isDirectory()) {
                results = results.concat(GetAllFilesFromFolder(file))
            } else {
                stat.birthtime
                let fecha_Hoy = moment()
                let fecha_modificacion = moment(stat.birthtime)
                results.push({
                    key: file,
                    size: stat.size,
                    modified: +moment().subtract(fecha_Hoy.diff(fecha_modificacion, 'days'), 'days')
                })
            };

        });
        return results;
    }
};