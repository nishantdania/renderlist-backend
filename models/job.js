const mongoose = require('mongoose'),  
	Schema = mongoose.Schema;

const JobSchema = new Schema({  
		position : String,
		city : String,
		url : String,
		company : String
	},
	{
	  timestamps: true
	}
);

module.exports = mongoose.model('Job', JobSchema);

