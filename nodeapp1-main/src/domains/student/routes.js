const express = require("express");
//const PDFDocument = require ('pdfkit');
// const fs = require('fs');
const multer = require('multer');
const mysql = require("mysql2");
const app = express();
const router = express.Router();

module.exports = router;


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname)
    },
  })

  const upload = multer({ storage: storage })
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test1_db",
    });
    connection.connect((err) => {
        if (err) return console.error(err.message);
        console.log("Connected to the MySQL database.");
        });
        
    
    
        app.post('/upload', upload.single('file'), (req, res) => {
            if (!req.file) {
              return res.status(400).send('No file uploaded.');
            }
            const pdfLink = `uploads/${req.file.filename}`;
            console.log(pdfLink)
            res.send("file uploaded")
    
    
            connection.query(
                'INSERT INTO table_name (pdf_column) VALUES (?)',
                [pdfLink],
                (error, results) => {
                  if (error) throw error;
                  res.send('PDF uploaded and link stored in database successfully.');
                }
              );
            });
    
            app.get('/download/:pdf_id', (req, res) => {
                connection.query(
                  'SELECT pdf_column FROM table_name WHERE id = ?',
                  [req.params.pdf_id],
                  (error, results) => {
                    if (error) throw error;
                    if (!results.length) {
                      return res.status(404).send('PDF not found.');
                    }
              
                    const pdfPath = results[0].pdf_column;
                    res.download(pdfPath);
                  }
                );
              });
              
              app.listen(3000, () => {
                console.log('Server running on port 3000.');
              });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // create a document 
    
    //const doc = new PDFDocument();
    
    //Pipe its output somewhere , like to a file or HTTP response 
    // see below for browsr usage 
    
    //doc.pipe(fs.createWriteStream('output.pdf'));
    
    // set the font size ,and render some text
    //doc
    //.fontSize(25)
    //.text('votre cv',100,100);
    
    //finalize pdf file
//doc.end();    