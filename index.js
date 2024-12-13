const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const routes = require('./routes/routes')
const path = require('path');
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

app.use('/Images', express.static(path.join(__dirname, 'Images')));
app.use("/uploads", express.static("uploads"));
const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGODB_URL, {
  dbName: 'greenjobdb'
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection successfully!");
});


app.listen(PORT, () => {
  console.log(`Server is up and running on port : ${PORT}`)
});
