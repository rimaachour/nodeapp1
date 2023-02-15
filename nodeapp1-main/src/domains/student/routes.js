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
              
              //app.listen(8080, () => {
               // console.log('Server running on port 3000.');
              //});
    
    



// Endpoint to generate PDF file
app.get('/generate-pdf', (req, res) => {
  // Query the database to get data for PDF
  connection.query('SELECT * FROM pddf', (error, results) => {
    if (error) throw error;

    // Generate HTML for PDF
    const html = `
      <h1>PDF File</h1>
      <table>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
        ${results.map(row => `
          <tr>
            <td>${row.id}</td>
            <td>${row.name}</td>
            <td>${row.email}</td>
          </tr>
        `).join('')}
      </table>
    `;

    // Generate PDF from HTML
    pdf.create(html).toFile('output.pdf', (err, result) => {
      if (err) return console.log(err);

      // Send PDF file to client
      res.setHeader('Content-Type', 'application/pdf');
      res.sendFile(path.join(__dirname, 'output.pdf'), (error) => {
        if (error) console.log(error);
        // Delete the generated PDF file after sending it
        fs.unlinkSync('output.pdf');
      });
    });
  });
});





















    
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




    
    
    
    
    
    
    
    
    
    
      