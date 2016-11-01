const Studio = require('../models/studio');
const User = require('../models/user');
	
exports.addStudio = function (req, res) {
	var studioData = req.body;
	var studio = new Studio();
	studio.name = studioData.name;
	studio.websiteURL = studioData.websiteURL;
	studio.city = studioData.city;
	studio.description = studioData.description;
	studio.showreelURL = studioData.showreelURL;
	studio._user = req.user._id;
	studio.save( function(err) {
		if(err) res.send('error');
	});
	User.findByIdAndUpdate(req.user._id, { studio : true }, function (err) {
		if (err) res.status(404).send();	
		else res.status(200).send();
	});
}

exports.getStudios = function (req, res) {
	Studio.find({}, function (err, studios) {
		if(err) res.send(err);
		res.send(studios);
	});	
}

exports.getMyStudio = function (req, res) {
	Studio.find({'_user' : req.user.id}, function (err, studio) {
		if(err) res.send(err);
		res.send(studio);
	});	
}
