const express = require('express'),
	app = express(),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	config = require('./config/main'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	passport = require('passport'),
	router = require('./router');

require('./config/passport')(passport);

mongoose.connect(config.database);

app.use(bodyParser.urlencoded({ extended: false  }));  
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieParser());

app.use(session({
	secret: 'someSecret',
	resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {  
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
 });

router(app, passport);

const server = app.listen(config.port, function () {
  console.log('Renderlist listening on port ' + config.port + ' !');
});

