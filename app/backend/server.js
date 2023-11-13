const express = require('express');
const mysql = require('mysql2');
require('dotenv').config({path:"./process.env"});
const app = express();
const port = 5000;

const connection = mysql.createConnection({
    host: process.env.DBHOST, 
    user: process.env.DBUSER,
    password:process.env.DBPASS,
    database: process.env.DBNAME
  });

  connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
  });
  

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


