const Job = require('../models/job');

exports.addJob = function(req, res) {
	var data = req.body;
	var job = new Job();
	job.company = data.company;
	job.url = data.url;
	job.city = data.city;
	job.position = data.position;
	job.save(function(err, job){
		if (err) res.status(400).send({'success' : false});
		else res.status(200).send({'success' : true});
	});
}

exports.getJobs = function(req, res) {
	Job.find({}, function(err, jobs) {
		if(err) res.status(400).send();
		else {
			res.status(200).send(jobs);
		}
	});
}
