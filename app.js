const express = require('express'),
	app = express(),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	config = require('./config/main');

mongoose.connect(config.database);

const server = app.listen(config.port, function () {
  console.log('Example app listening on port ' + config.port + '!');
});

app.use(bodyParser.urlencoded({ extended: false  }));  
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(function(req, res, next) {  
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
 });

app.get('/', function (req, res) {
  res.send('Hello World!');
});

