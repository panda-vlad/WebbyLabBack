const express = require('express');
const mongoose = require('mongoose');
const middlewares = require('./middlewares/middlewares.js')
const db = require('./mongoose/config').mongoURI;
const films = require('./router/api/films')

//Intial app
const app = express();

// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// app.use(cors())
// app.use(fileUpload());
// app.use(bodyParser.json())

app.use(middlewares.urlencoded)
app.use(middlewares.json)
app.use(middlewares.cors)
app.use(middlewares.fileUpload)

// routess
films(app)

app.set('json spaces', 3);

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('Connected'))
  .catch(err => console.log(err));



const server = app.listen(3001, (error) => {
  if (error) return console.log(err);
  console.log('OK server run on port 3001');
});

module.exports = server;
