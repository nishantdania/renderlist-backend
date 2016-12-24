const Username = require('../models/username');
const Studio = require('../models/studio');
const User = require('../models/user');
const async = require("async");

exports.incViews = function(req, res) {
console.log('here');
	if (req.body.username == undefined || req.method == 'OPTIONS') 
		res.status(400).send({'success' : false});
	else {
		Username.findOne({'username' : req.body.username}, function(err, username) {
			if (err) res.status(400).send({'success' : false});
			else if (username) {
				var sid = username.sid;
				Studio.findByIdAndUpdate(sid, {$inc: {views:1}}, function(err, studio) {
					res.status(200).send({'success' : true});
				});
			}
		});
	}
}

exports.getProfile = function(req, res) {
	if (req.body.username == undefined) {
		res.status(404).send({'success' : false, 'message' : 'Invalid data'});
	}
	else {
		Username.findOne({'username' : req.body.username}, function(err, username) {
			if (err) res.status(400).send({'success' : false});
			else if(username) {
				var sid = username.sid;
				var uid = username.uid;
				var showreelData = {};
				var userData = {};
				var asyncTasks = [];
				asyncTasks.push(function(callback) {
					Studio.findById(sid, function(err, showreel) {
						if (err) callback;
						else {
							showreelData = showreel;
							callback();
						}
					});	
				});
				asyncTasks.push(function(callback) {
					User.findById(uid, function(err, user) {
						if (err) callback;
						else {
							userData = user;
							callback();
						}
					});	
				});
				async.parallel(asyncTasks, function() {
					var data = {};
					if (Object.keys(userData).length === 0 || Object.keys(showreelData).length === 0) {
						data.success = false;
					}
					else {
						data.profile = {};
						data.profile.name = showreelData.name;
						data.profile.city = showreelData.city;
						data.profile.description = showreelData.description;
						data.profile.websiteURL = showreelData.websiteURL;
						data.profile.showreelURL = showreelData.showreelURL;
						data.profile.email = showreelData.email;
						data.profile.tags = showreelData.tags;
						data.profile.likes = showreelData.likes;
						data.profile.views = showreelData.views;
						data.profile.ts = showreelData._id.getTimestamp().getTime();
						data.profile.thumbnail = showreelData.thumbnail[5].link;
						data.profile.profilePhoto = userData.facebook ? userData.facebook.profilePhoto : userData.google.profilePhoto;
						data.success = true;
					}
					res.status(200).send({'data' : data});	
				});
			}
			else {
				res.status(400).send({'success' : false, 'message' : 'No username found'});
			}
		});
	}
}


