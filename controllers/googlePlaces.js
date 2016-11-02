var request = require('request');

exports.getPlaces = function(req, res) {
	var input = req.body.input;
	var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + input + '&types=(cities)&language=en&key=AIzaSyCoeCH-Vv1b_ASZOgW_4Dl18X2FS0Tk3vI';
	request(url, function (err, response, body) {
			if (body) {
				var placesTrimmed = [];
				var obj = JSON.parse(body);
				var predictions = obj.predictions;
				for (var i in predictions) {
					var temp = predictions[i];
					placesTrimmed.push({
						description : temp.description,
						place_id : temp.place_id
					});
				}
				var data = {places : placesTrimmed};
				res.send(data);	
			} 
		else res.status(404).send();
	});
}
