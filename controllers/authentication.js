"use strict";

const jwt = require('jsonwebtoken'),
	User = require('../models/user'),
	Username = require('../models/username'),
	async = require("async"),
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
	if (req.user.studio) redirectURL = redirectURL + '&hasStudio=true';
	res.redirect(redirectURL);
}

exports.checkState = function(req, res, next) {
	var token = req.body.token.slice(4);
	jwt.verify(token, config.secret, function(err, decoded) {
		if (err) res.status(400).send({'success' : false });
		else {
			User.findOne({_id : decoded.id}, function(err, user) {
				if (err) res.status(400).send({'success' : false });
				else {
					var data = {};
					if (user.google.id){
						data.name = user.google.name;
						data.email = user.google.email;	
						data.profilePhoto = user.google.profilePhoto;
					}
					else if (user.facebook.id){
						data.name = user.facebook.name;
						data.email = user.facebook.email;	
						data.profilePhoto = user.facebook.profilePhoto;
					}
					data.success = true;
					data.hasStudio = user.studio;
					var asyncTasks = [];
					asyncTasks.push(function(callback) {
						Username.findOne({'uid' : user._id}, function(err, username) {
							if (err) {
								res.status(400).send({'success' : false});
								callback();
								return;
							}
							else if (username) {
								data.username = username.username;
								callback();	
							}
							else {
								data.username = '';
								callback();
							}
						});	
					});
					async.parallel(asyncTasks, function() {
						res.status(200).send(data);
					});
				}			
			});	
		}	
	});
}	

exports.checkAdminAccess = function(req, res, next) {
	if(req.headers.adminkey == config.adminKey){
		next();
	}
	else {
		res.status(403).send('Forbidden');
	}
}
