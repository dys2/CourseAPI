const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

const server = express();
server.use(bodyParser.json());
server.use(cors());

const port = process.env.PORT || 5000;
routes(server);

mongoose.connect('mongodb://localhost/test');

server.listen(port, () => {
  console.log('server running')
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to db');
});