"use strict";

const jwt = require('jsonwebtoken'),
	User = require('../models/user'),
	config = require('../config/main');

function generateToken(user) {
	return jwt.sign(user, config.secret, {
		expiresIn: config.loginTokenExpiration 
	});
}

exports.socialLogin = function(req, res, next) {
	var token = '';
	if(req.user.facebook.id)	token = 'JWT ' + generateToken({id :req.user.facebook.id});
	else if(req.user.google.id)	token = 'JWT ' + generateToken({id :req.user.google.id});
	var redirectURL = req.session.redirect + '?token=' + token;
	res.redirect(redirectURL);
}

