const Studio = require('../models/studio');

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
