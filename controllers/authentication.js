"use strict";

const jwt = require('jsonwebtoken'),
	crypto = require('crypto'),
	User = require('../models/user'),
	config = require('../config/main');

function generateToken(user) {
	return jwt.sign(user, config.secret, {
		expiresIn: 10080 // in seconds
	});
}

function setUserInfo(request) {
	let getUserInfo = {
		_id: request._id,
		firstName: request.profile.firstName,
		lastName: request.profile.lastName,
		username: request.username,
		role: request.role,
	};
	return getUserInfo;
}

exports.login = function(req, res, next) {
		let userInfo = setUserInfo(req.user);
		res.status(200).json({
			token: 'JWT ' + generateToken(userInfo),
			user: userInfo
	});
}


exports.register = function(req, res, next) {
	const username = req.body.username;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const password = req.body.password;

	if (!username) {
	return res.status(422).send({ error: 'You must enter an username .' });

	}

	if (!firstName || !lastName) {
		return res.status(422).send({ error: 'You must enter your full name.' });
	}

	if (!password) {
		return res.status(422).send({ error: 'You must enter a password.'  });
	}

	User.findOne({ username : username }, function(err, existingUser) {
	if (err) { return next(err);  }

	if (existingUser) {
		return res.status(422).send({ error: 'That username is already in use.'  });
	}

	let user = new User({
		username: username ,
		password: password,
		profile: { firstName: firstName, lastName: lastName  }
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
