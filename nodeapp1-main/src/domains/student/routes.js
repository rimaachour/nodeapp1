const express = require("express");
const PDFDocument = require("pdfkit");
//const fs = require('fs');
const multer = require('multer');
const mysql = require("mysql2");
const exphbs = require('express-handlebars');

const mysqlPormise = require('mysql2/promise') // you import this package when you want to use execute function with the connection
const app = express();
const router = express.Router();
const { Router } = require("express");
//const app = require("../..");



                


//module.exports =  app;




  




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
        





const storage = multer.memoryStorage();

//const upload = multer({
  //storage,
  //limits: { fileSize: 1000000 }, // limit file size to 1 MB
  //fileFilter: (req, file, cb) => {
    //if (file.mimetype.startsWith('image/')) {
      //cb(null, true);
    //} else {
      //cb(new Error('File type not allowed.'));
    //}
  //}
//});
// 
//app.post('/add', upload.single('image'), (req, res) => {
 //const { nom, prenom, email, specialite } = req.body;
  //const image = req.file.buffer;

  //const query = 'INSERT INTO students (nom, prenom, email, image,specialite) VALUES (?, ?, ?, ?, ?)';
  //const params = [nom, prenom, email, specialite,image];

 // connection.query(query, params, (error, results, fields) => {
   // if (error) throw error;

    //console.log('Student record inserted successfully!');
    //res.send('Student record inserted successfully!');
  //});
//});

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test1_db'
});

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



//const upload = multer({ dest: 'uploads/' });
router.post('/add', upload.single('image'), (req, res) => {
  // Get the student data from the request body
  const { nom, prenom, email, specialite } = req.body;

  // Get the path of the uploaded image file
  const image = req.file.buffer;

  // Read the contents of the image file into a buffer


  // Create a MySQL connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).send('Error connecting to database');
    } else {
      // Insert the student data and image into the database
      connection.query('INSERT INTO students (nom, prenom, email, specialite, image) VALUES (?, ?, ?, ?, ?)', [nom, prenom, email, specialite, image], (err, result) => {
        if (err) {
          console.log(err.message);
          res.status(500).send('Error uploading student to database');
        } else {
          res.send('Student uploaded successfully');
        }

        // Release the connection back to the pool
        connection.release();
      });
    }
  });
});


    
        router.post('/upload', upload.single('file'), (req, res) => {
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
           router.get('/download/:pdf_id', (req, res) => {
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

             
              const connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: "",
                database: 'test1_db'
                });
                              
                //connection.connect();
                
                
                 
                connection.connect((err) => {
                  if (err) {
                    console.error("Error connecting to database: " + err.stack);
                    return;
                  }
                  console.log("Connected to database.");
                });

                // Configure handlebars as the template engine
            //router.engine('handlebars', exphbs());

  router.engine('handlebars', exphbs.engine());

 router.set('view engine', 'handlebars');
                router.get('/pdf', async (req, res, next) => {
                  connection.query('SELECT * FROM students', (err, results) => {
                    if (err) {
                      console.error(err);
                      res.status(500).send('Error retrieving student data from database.');
                      return;
                    }
                

    // Render student data as an HTML table using handlebars
    const template = `
      <h1>Student Data</h1>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prenom</th>
            <th>Email</th>
            <th>Specialite</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {{#each students}}
            <tr>
              <td>{{this.nom}}</td>
              <td>{{this.prenom}}</td>
              <td>{{this.email}}</td>
              <td>{{this.specialite}}</td>
              <td>{{this.image}}</td>
            </tr>
          {{/each}}
        </tbody>
      </table>
    `;
    const handlebars = exphbs.create({});
    const templateFn = handlebars.compile(template);
    const html = templateFn({ students: results })

    // Create PDF document
                    const doc = new PDFDocument();
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', 'attachment; filename=student.pdf');
                    doc.pipe(res);
                    doc.font('Helvetica-Bold');
                    doc.fontSize(16);
                    doc.text('Student Data', { align: 'center' });
                    doc.moveDown(0.5);
                    doc.fontSize(12);
                    doc.font('Helvetica');
                    doc.text(html, { align: 'justify' });
                    doc.end();
                  });
                });



    //doc.text("Table Data:");
    //doc.moveDown();
    //doc.table({
      //headers: Object.keys(results[0]),
      //rows: results.map((row) => Object.values(row)),
    //});

    // End the PDF document and close the HTTP response
    



      
    
    
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


///hello 


module.exports = router;
    
    
    
    
    
    
    
    
    
      