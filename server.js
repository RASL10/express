const express = require('express');
const mysql = require('sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const apiRouter = require('./api/api');


const app = express();
const PORT = process.env.PORT || 4000;



app.use(bodyParser.json());
app.use(cors());


app.use(errorhandler());

app.use('/api', apiRouter);





app.listen(PORT, () => {
  console.log('Listening on port: ' + PORT);
});

module.exports = app;