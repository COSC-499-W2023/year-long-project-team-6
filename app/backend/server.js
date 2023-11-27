const express = require('express');
const cors = require('cors');
const PostDao = require('./dao/PostDao'); 
 const mysql = require('mysql');
 require('dotenv').config({ path: "./process.env" });
const app = express();
const port = 5001;

const connection = mysql.createConnection({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME
});

connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});
const postDao = new PostDao(connection);
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log("Login request received with data:", req.body);
  postDao.authenticateUser(email, password, (err, userExists) => {
      if (err) {
        console.error("Error during authentication:", err);
          res.status(500).send('Error during authentication');
      } else if (userExists) {
        console.log("Authentication result:", userExists);
          postDao.getUserByEmail(email, (err, user) => {
              if (err) {
                console.log("Error fetching user data:", err.message);
                  res.status(500).send('Error fetching user data');
              } else {
                console.log("successful fetching user data");
                  res.status(200).json({ success: true, user: user });
              }
          });
      } else {
          res.status(401).send('Invalid credentials');
      }
  });
});
const postRouter = require('./router/postRouter');
app.use(postRouter);

const recordedRouter = require('./router/recordedRouter');
app.use(recordedRouter);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


