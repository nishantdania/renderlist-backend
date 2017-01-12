const Studio = require('../models/studio');
const User = require('../models/user');

exports.updateShowreelThumbnail = function (req, res) {
	if(req.body.type == 'vimeo') {
		if(req.body.id == undefined || req.body.thumbnailList == undefined) {
			res.status(400).send('Invalid Data');
		}
		else {
			Studio.findByIdAndUpdate(req.body.id, { thumbnail : req.body.thumbnailList }, function (err) {
				if (err) res.status(400).send({'success' : false});	
				else res.status(200).send({'success' : true});
			});
		}
	}	
	else {
		res.status(400).send('Incorrect Type.')
	}
}

exports.verifyShowreel = function (req, res) {
	if(req.body.id == undefined || req.body.verify == undefined) {
		res.status(400).send('Invalid Data');
	}
	else {
		Studio.findByIdAndUpdate(req.body.id, { isVerified : req.body.verify }, function (err) {
			if (err) res.status(400).send({'success' : false});	
			else res.status(200).send({'success' : true});
		});
	}
}

exports.editTags = function(req, res) {
	Studio.findByIdAndUpdate(req.body.sid, { 'tags' : req.body.tags }, function(err, studio) {
		res.status(200).send({'success' : true});
	});
}

exports.editCity = function(req, res) {
	Studio.findByIdAndUpdate(req.body.sid, { 'city' : req.body.city }, function(err, studio) {
		res.status(200).send({'success' : true});
	});
}

exports.editShowreelURL = function(req, res) {
	Studio.findByIdAndUpdate(req.body.sid, { 'showreelURL' : req.body.showreelURL }, function(err, studio) {
		res.status(200).send({'success' : true});
	});
}

exports.getUsers= function(req, res) {
	User.find({}, function(err, users) {
		res.status(200).send(users);
	});
}
