const mongoose = require('mongoose'),  
	Schema = mongoose.Schema;

const MessageSchema = new Schema({  
		name : String,
		email : String,
		message : String
	},
	{
	  timestamps: true
	}
);

module.exports = mongoose.model('Message', MessageSchema);

