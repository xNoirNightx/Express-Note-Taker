// import promise
const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// read data from database 
const readDatabase = async () => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    throw new Error('Failed to read the database.');
  }
};

// write data to the database file
const writeDatabase = async (data) => {
  try {
    await fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(data), 'utf8');
  } catch (err) {
    console.error(err);
    throw new Error('Failed to write to the database.');
  }
};

//  api / read notes from database 

app.get('/api/notes', async (req, res) => {
  try {
    const notes = await readDatabase(); 
    return res.json(notes);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/notes', async (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) {
    return res.status(400).json({ error: 'Title and text are required fields.' });
  }

  // Read the notes  / add  new note / write and update notes 
  try {
    let notes = await readDatabase(); 
    const newNote = { id: Date.now().toString(), title, text };
    notes.push(newNote); 
    await writeDatabase(notes); 
    return res.json(newNote);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// add delete funtcions / filter notes / update to array
app.delete('/api/notes/:id', async (req, res) => {
  const noteId = req.params.id;

  try {
    let notes = await readDatabase(); 
    notes = notes.filter((note) => note.id !== noteId); 
    await writeDatabase(notes);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

//  start server 
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});