require('dotenv').config({ path: "./process.env" });

const express = require('express');
const cors = require('cors');
const http = require('http');
const PostDao = require('./dao/PostDao');
const createUserRouter = require('./router/userRouter');

const app = express();
const port = 5001;

// Database connection setup
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
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
const awsRouter = require('./router/awsRouter');
app.use(awsRouter);

app.use('/api/auth', createUserRouter(postDao));
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require('./router/userRouter');
app.use(userRouter);

const postRouter = require('./router/postRouter');
app.use(postRouter);

const recordedRouter = require('./router/recordedRouter');
app.use(recordedRouter);

const groupRouter = require('./router/groupRouter');
app.use(groupRouter);

const profileRouter = require('./router/profileRouter');
app.use(profileRouter);

const homeRouter = require('./router/homeRouter');
app.use(homeRouter);

const group_member_board_Router = require('./router/group_member_board_Router');
app.use(group_member_board_Router);


const selectGroupRouter = require('./router/selectGroupRouter');
app.use(selectGroupRouter);

const groupPostRouter = require('./router/groupPostRouter');
app.use(groupPostRouter);


const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

