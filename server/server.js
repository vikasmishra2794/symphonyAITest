const express = require('express')
const bodyParser = require('body-parser');
const readline = require('readline');
const fs = require('fs');

const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();
const port = 8080;

app.use(cors());

app.use((req, res, next) => {
    res.set({
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
       'Access-Control-Allow-Headers': 'Content-Type'
     })
     next();
})

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  fileUpload({
    useTempFiles: true,
    safeFileNames: true,
    preserveExtension: true,
    tempFileDir: `${__dirname}/public/files`
  })
);

app.post('/upload', (req, res, next) => {
    console.log("Inside of /upload");
    let uploadFile = req.files.file;
    const name = uploadFile.name;
    
    uploadFile.mv(`${__dirname}/public/files/${name}`, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        fs.readFile(`${__dirname}/public/files/${name}`, function (err, data) {
            if (err) throw err;
            var fileData = data.toString().split("\n");
            return res.status(200).json({ status: 'uploaded', fileData });
        });
    });
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
});
