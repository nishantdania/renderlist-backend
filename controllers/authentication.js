"use strict";

const jwt = require('jsonwebtoken'),
	crypto = require('crypto'),
	User = require('../models/user'),
	config = require('../config/main');

function generateToken(user) {
	return jwt.sign(user, config.secret, {
		expiresIn: config.loginTokenExpiration 
	});
}

function setUserInfo(request) {
	let getUserInfo = {
		_id: request._id,
		email: request.email
	};
	return getUserInfo;
}

exports.login = function(req, res, next) {
		let userInfo = setUserInfo(req.user);
		console.log('login req : '+req);
		res.status(200).json({
			token: 'JWT ' + generateToken(userInfo),
			user: userInfo
	});
}


exports.register = function(req, res, next) {
	let email = req.body.email;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const password = req.body.password;

	if (!email) {
	return res.status(422).send({ error: 'You must enter an email.' });

	}

	if (!firstName || !lastName) {
		return res.status(422).send({ error: 'You must enter your full name.' });
	}

	if (!password) {
		return res.status(422).send({ error: 'You must enter a password.'  });
	}

	User.findOne({ email: email}, function(err, existingUser) {
		if (err) { return next(err);  }

		if (existingUser) {
			return res.status(422).send({ error: 'That email is already in use.'  });
		}

		let user = new User({
			email: email,
			password: password,
			firstName: firstName,
			lastName: lastName
		});

		user.save(function(err, user) {
			if (err) { return next(err);  }
			let userInfo = setUserInfo(user);
			res.status(201).json({
				token: 'JWT ' + generateToken(userInfo),
				user: userInfo
			});

		});
	});
}
