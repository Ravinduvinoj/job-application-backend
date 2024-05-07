const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const routes = require('./routes/routes')

const cors = require('cors');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');

const app = express();


app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}));

app.use(cookieParser())

app.use(express.json())
app.use("/api", routes)

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URL, {
    dbName: 'greenjobdb',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const connection = mongoose.connection;
  connection.once("open", () =>{
    console.log("MongoDB connection successfully!");
  });

  
app.listen(PORT, () => {
    console.log(`Server is up and running on port : ${PORT}`)
  });
  