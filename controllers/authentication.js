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
	token = 'JWT ' + generateToken({id :req.user._id});
	var redirectURL = req.session.redirect + '?token=' + token;
	res.redirect(redirectURL);
}

exports.checkState = function(req, res, next) {
	var token = req.body.token.slice(4);
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err) res.send({'success' : false });
		else {
			User.findOne({_id : decoded.id}, function(err, user) {
				if (err) res.send({'success' : false });
				else res.send(user);
			});	
		}	
	});
}	

