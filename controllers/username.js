const Username = require('../models/username');

exports.addUsername = function(req, res) {
	var data = req.body;
	var username = new Username();
	username.username = data.username;
	username.sid = data.sid;
	username.uid = data.uid;
	username.save(function(err, username){
		if (err) res.status(400).send({'success' : false});
		else res.status(200).send({'success' : true});
	});
}

exports.getUsernames = function(req, res) {
	Username.find({}, function(err, usernames) {
		if (err) res.status(400).send({'success' : false});
		else {
			res.status(200).send({'usernames' : usernames});
		}
	});
}


