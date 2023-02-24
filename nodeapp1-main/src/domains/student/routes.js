const express = require("express");
//const PDFDocument = require ('pdfkit');
// const fs = require('fs');
const multer = require('multer');
const mysql = require("mysql2");
const app = express();
const router = express.Router();
module.exports =  app;
//module.exports = router;



  




//const storage = multer.diskStorage({
   // destination: (req, file, cb) => {
    //  cb(null, "./uploads")
    //},
    //filename: (req, file, cb) => {
      //cb(null, Date.now() + "-" + file.originalname)
    //},
  //})

  //const upload = multer({ storage: storage })
//const connection = mysql.createConnection({
  //  host: "localhost",
    //user: "root",
    //password: "",
    //database: "test1_db",
    //});
    //connection.connect((err) => {
      //  if (err) return console.error(err.message);
        //console.log("Connected to the MySQL database.");
        //});
        

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "",
  database: 'test1_db'
});

connection.connect();




const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // limit file size to 1 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed.'));
    }
  }
});
// nouveau update image 
app.post('/add', upload.single('image'), (req, res) => {
 const { nom, prenom, email, specialite } = req.body;
  const image = req.file.buffer;

  const query = 'INSERT INTO students (nom, prenom, email, image,specialite) VALUES (?, ?, ?, ?, ?)';
  const params = [nom, prenom, email, specialite,image];

  connection.query(query, params, (error, results, fields) => {
    if (error) throw error;

    console.log('Student record inserted successfully!');
    res.send('Student record inserted successfully!');
  });
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
    //this is nothing but a regular comment
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
              
              //app.listen(8080, () => {
               // console.log('Server running on port 3000.');
              //});
    
    
    
    // partie crud 

    // Create a new student
    router.post('/students', (req, res) => {
      const {nom,prenom,email,specialité  } = req.body;
      const sql = `INSERT INTO students (nom, prenom, email, specialité) VALUES ('${nom}', '${prenom}', '${email}','${specialité}')`;
      
      connection.query(sql, (error, results) => {
        if (error) throw error;
        res.send('Student added successfully.');
      });
    });
    
   
router.get('/students', (req, res) => {
  connection.query('SELECT * FROM students', (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// Retrieve a single student by id
router.get('/students/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM students WHERE id = ?', id, (error, results) => {
    if (error) throw error;
    res.send(results[0]);
  });
});

// Update a student by id
router.put('/students/:id', (req, res) => {
  const id = req.params.id;
  const student = req.body;
  connection.query('UPDATE students SET ? WHERE id = ?', [student, id], (error, results) => {
    if (error) throw error;
    res.send(`Student updated with ID: ${id}`);
  });
});

// Delete a student by id
router.delete('/students/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM students WHERE id = ?', id, (error, results) => {
    if (error) throw error;
    res.send(`Student deleted with ID: ${id}`);
  });
});




    
    
    
    
    
    
    
    
    
    
      