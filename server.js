require('./loadEnvironment.js');
const pool = require('./db.js');    
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;  

app.use(express.json());


app.get('/status', (req, res) => {
  res.send('Status: OK');
}); 


app.get('/units/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testunit;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/units/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM testunit WHERE id = $1;', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Unit not found' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/units/', async (req, res) => {
  const { name, type } = req.body;
  try {
    const result = await pool.query('INSERT INTO testunit (name, type) VALUES ($1, $2)', [name, type]);
    res.status(201).send(`Successfully added unit -> name: ${name}, type: ${type}`);
  } catch (error) {
    console.error('Error inserting unit:', error);
    res.status(500).json({ error: 'Internal Server Error' });   
  }
});


app.patch('/units/:id', async (req, res) => {
    const { id } = req.params;
    const { name, type } = req.body;  

    try {   
        const result = await pool.query(
            'UPDATE testunit SET name = $1, type = $2 WHERE id = $3 RETURNING *;',
            [name, type, id]
        );  
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Unit not found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error updating unit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } 
});


app.delete('/units/:id', async (req, res) => {
  const { id } = req.params;    
  try {
    const result = await pool.query('DELETE FROM testunit WHERE id = $1 RETURNING *;', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Unit not found' });
    } else {
      res.status(200).send(`Successfully deleted unit with ID: ${id}`);
    }
  } catch (error) {
    console.error('Error deleting unit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
