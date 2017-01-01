const Studio = require('../models/studio');
const User = require('../models/user');
const Username = require('../models/username');
const async = require("async");
var multer  = require('multer');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '_' + Math.random().toString(36).substring(7) + '_' + file.originalname); //Appending extension
	}
});

var upload = multer({ storage : storage }).single('showreelFile');

exports.addStudio = function (req, res) {
	var studioData = req.body;
	var studio = new Studio();
	studio.name = studioData.name;
	studio.websiteURL = studioData.websiteURL;
	studio.city = studioData.city;
	studio.place = studioData.place;
	studio.description = studioData.description;
	studio.showreelURL = studioData.showreelURL;
	studio.email = studioData.email;
	studio.tags = studioData.tags;
	studio.isStudio = studioData.isStudio;
	studio._user = req.user._id;
	studio.save( function(err) {
		if(err) res.status(400).send({ 'message' : 'error'});
	});
	User.findByIdAndUpdate(req.user._id, { studio : true }, function (err) {
		if (err) res.status(400).send({'success' : false});	
		else res.status(200).send({'success' : true});
	});
}

exports.uploadShowreel = function (req, res) {
	upload(req, res, function(err) {
	if(err) {
		res.status(400).send({'success' : false});
		return;
	}
	setTimeout(
	()=> {res.status(200).send({'success' : true});
	}, 5);
	});
}

exports.getStudios = function (req, res) {
	Studio.find({}, function (err, studios) {
		if(err) res.status(400).send({'success' : false});
		res.status(200).send(studios);
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
							primaryData.views = showreel.views;
							primaryData.thumbnail = showreel.thumbnail[3].link;
							primaryData.ts = showreel._id.getTimestamp().getTime();
							primaryData.showreelURL = showreel.showreelURL;
							Username.findOne({'sid' : showreel._id}, function(err, username) {
								if (err) {
									callback();
									return;
								}
								else {
									primaryData.username = username.username;
									showreels.push(primaryData);
									callback();
								}
							}); 
						}		
						else {
							callback();
						}
					});
				});	
			});
			async.parallel(asyncTasks, function() {
				if (req.body.sortId == 1)
					showreels.sort((a, b) => b.views - a.views);
				else {
					showreels.sort((a, b) => b.ts - a.ts);
				}
				var data = {};
				data.showreels = showreels;
				data.success = true;
				res.status(200).send(data);
			});
		}
	});
}

exports.search = function (req, res) {
	var searchQuery = req.body.searchQuery;
	var tags = searchQuery.split(" ");
	Studio.where('isVerified', true)
		.where('tags').in(tags)
		.exec(function (err, studios) {
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
							primaryData.views = showreel.views;
							primaryData.thumbnail = showreel.thumbnail[3].link;
							primaryData.ts = showreel._id.getTimestamp().getTime();
							primaryData.showreelURL = showreel.showreelURL;
							Username.findOne({'sid' : showreel._id}, function(err, username) {
								if (err) {
									callback();
									return;
								}
								else {
									primaryData.username = username.username;
									showreels.push(primaryData);
									callback();
								}
							}); 
						}		
						else {
							callback();
						}
					});
				});	
			});
			async.parallel(asyncTasks, function() {
				if (req.body.sortId == 1)
					showreels.sort((a, b) => b.views - a.views);
				else {
					showreels.sort((a, b) => b.ts - a.ts);
				}
				var data = {};
				data.showreels = showreels;
				data.success = true;
				res.status(200).send(data);
			});

		});
}

