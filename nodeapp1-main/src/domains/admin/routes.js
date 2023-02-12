const express = require("express");
const router = express.Router();

// crud student : 
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

  // crud entreprise: 

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

  // crud offre:
   //create a  new offre 
   router.post('/offres', (req, res) => {
    const {titre,description,localisation  } = req.body;
    const sql = `INSERT INTO offres (titre, description,localisation) VALUES ('${titre}', '${description}', '${localisation}')`;
    
    connection.query(sql, (error, results) => {
      if (error) throw error;
      res.send('offre added successfully.');
    });
  });

  router.get('/offres', (req, res) => {
    connection.query('SELECT * FROM offres', (error, results) => {
      if (error) throw error;
      res.send(results);
    });
    });


    // Update a offre by id
router.put('/offres/:id', (req, res) => {
  const id = req.params.id;
  const offre = req.body;
  connection.query('UPDATE offres SET ? WHERE id = ?', [offre, id], (error, results) => {
    if (error) throw error;
    res.send(`offre updated with ID: ${id}`);
  });
  });

  // Delete an offre by id
router.delete('/offres/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM offres WHERE id = ?', id, (error, results) => {
    if (error) throw error;
    res.send(`offre deleted with ID: ${id}`);
  });
  });
  




module.exports = router;



