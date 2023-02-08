const express = require("express");
//const {sendEmail} = require("./../../utils/sendEmail")
const router = express.Router();
const mysql = require("mysql2");
const app = express();





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






// partie crud 


// Create a new entreprise
router.post('/entreprise', (req, res) => {
    const {nom,domaine,localisation  } = req.body;
    const sql = `INSERT INTO entreprise (nom, domaine, localisation) VALUES ('${nom}', '${domaine}', '${localisation}')`;
    
    connection.query(sql, (error, results) => {
      if (error) throw error;
      res.send('entreprise added successfully.');
    });
  });
  
 
router.get('/entreprise', (req, res) => {
connection.query('SELECT * FROM entreprise', (error, results) => {
  if (error) throw error;
  res.send(results);
});
});

// Retrieve a single entreprise by id
router.get('/entreprise/:id', (req, res) => {
const id = req.params.id;
connection.query('SELECT * FROM entreprise WHERE id = ?', id, (error, results) => {
  if (error) throw error;
  res.send(results[0]);
});
});

// Update a entreprise by id
router.put('/entreprise/:id', (req, res) => {
const id = req.params.id;
const student = req.body;
connection.query('UPDATE entreprise SET ? WHERE id = ?', [student, id], (error, results) => {
  if (error) throw error;
  res.send(`Entreprise updated with ID: ${id}`);
});
});

// Delete a entreprise by id
router.delete('/entreprise/:id', (req, res) => {
const id = req.params.id;
connection.query('DELETE FROM entreprise WHERE id = ?', id, (error, results) => {
  if (error) throw error;
  res.send(`entreprise deleted with ID: ${id}`);
});
});
























module.exports = router;
