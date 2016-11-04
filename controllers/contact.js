const Message = require('../models/message');

exports.saveMessage = function(req, res) {
	var data = req.body;
	var message = new Message();
	message.name = data.name;
	message.email = data.email;
	message.message = data.message;
	message.save(function(err, message){
		if (err) res.status(400).send({'success' : false});
		else res.status(200).send({'success' : true});
	});

}


