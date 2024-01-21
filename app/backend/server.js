require('dotenv').config({ path: "./process.env" });

const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
const port = 5001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
const awsRouter = require('./router/awsRouter');
app.use(awsRouter);


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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

