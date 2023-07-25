// import promise
const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//  removed starter code it was giving me errors and confusing me 

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