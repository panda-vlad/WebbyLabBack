const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const db = require('./mongoose/config').mongoURI;
const films = require('./router/api/films')
const app = express(),
cors = require('cors');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors())

app.use(fileUpload());

app.set('json spaces', 3);

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('Connected'))
  .catch(err => console.log(err));

films(app)

const server = app.listen(3001, (error) => {
  if (error) return console.log(err);
  console.log('OK server run on port 3001');
});

module.exports = server;
