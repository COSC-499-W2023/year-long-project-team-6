const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require('./router/userRouter');
app.use(userRouter);

const postRouter = require('./router/postRouter');
app.use(postRouter);

const recordedRouter = require('./router/recordedRouter');
app.use(recordedRouter);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


