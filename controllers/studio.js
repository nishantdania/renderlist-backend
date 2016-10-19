const Studio = require('../models/studio');
	
exports.addStudio = function (req, res) {
console.log(req.user);
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
	res.status(200).send();
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
