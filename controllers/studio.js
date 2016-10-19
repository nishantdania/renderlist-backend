const Studio = require('../models/studio');
	
exports.addStudio = function (req, res) {
	var studioData = req.body;
	var studio = new Studio();
	studio.name = studioData.name;
	studio.websiteURL = studioData.websiteURL;
	studio.city = studioData.city;
	studio.description = studioData.description;
	studio.showreelURL = studioData.showreelURL;
	studio.save( function(err) {
		if(err) res.send('error');
	});
	res.send('hmm');
}

exports.getStudios = function (req, res) {
	Studio.find({}, function (err, studios) {
		if(err) res.send(err);
		res.send(studios);
	});	
}
