const Studio = require('../models/studio');
const User = require('../models/user');
const async = require("async");

exports.addStudio = function (req, res) {
	var studioData = req.body;
	var studio = new Studio();
	studio.name = studioData.name;
	studio.websiteURL = studioData.websiteURL;
	studio.city = studioData.city;
	studio.description = studioData.description;
	studio.showreelURL = studioData.showreelURL;
	studio.email = studioData.email;
	studio.isStudio = studioData.isStudio;
	studio._user = req.user._id;
	console.log(studio);
	studio.save( function(err) {
		if(err) res.status(400).send({ 'message' : 'error'});
	});
	User.findByIdAndUpdate(req.user._id, { studio : true }, function (err) {
		if (err) res.status(400).send({'success' : false});	
		else res.status(200).send({'success' : true});
	});
}

exports.getStudios = function (req, res) {
	Studio.find({}, function (err, studios) {
		if(err) res.status(400).send({'success' : false});
		res.status(200).send(studios);
	});	
}

exports.getMyStudio = function (req, res) {
	Studio.find({'_user' : req.user.id}, function (err, studio) {
		if(err) res.status(400).send({'success' : false});
		res.status(200).send(studio);
	});	
}

exports.getVerifiedShowreels = function (req, res) {
	Studio.find({'isVerified' : true}, function (err, studios) {
		if(err) res.status(404).send({'success' : false});
		else {
			var showreels = [];
			var asyncTasks = [];
			studios.forEach(function(showreel, index) {
				asyncTasks.push(function(callback) {
					var primaryData = new Object();
					User.findById(showreel._user, function(err, user) {
						if (user) {
							primaryData.userProfilePhoto = user.facebook ? user.facebook.profilePhoto : user.google.profilePhoto;
							primaryData.name = showreel.name;
							primaryData.city = showreel.city;
							primaryData.likes = showreel.likes;
							primaryData.thumbnail = showreel.thumbnail[3].link;
							primaryData.sid = showreel._id;
							primaryData.ts = showreel._id.getTimestamp().getTime();
							showreels.push(primaryData);
							callback();
						}		
						else {
							callback();
						}
					});
				});	
			});
			async.parallel(asyncTasks, function() {
				showreels.sort((a, b) => b.ts - a.ts);
				var data = {};
				data.showreels = showreels;
				data.success = true;
				res.status(200).send(data);
			});
		}
	});
}
