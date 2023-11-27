const express = require('express');
const cors = require('cors');
// const mysql = require('mysql');
// require('dotenv').config({ path: "./process.env" });
const app = express();
const port = 5000;

// const connection = mysql.createConnection({
//   host: process.env.DBHOST,
//   user: process.env.DBUSER,
//   password: process.env.DBPASS,
//   database: process.env.DBNAME
// });

// connection.connect(error => {
//   if (error) throw error;
//   console.log("Successfully connected to the database.");
// });
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const postRouter = require('./router/postRouter');
app.use(postRouter);

const recordedRouter = require('./router/recordedRouter');
app.use(recordedRouter);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


