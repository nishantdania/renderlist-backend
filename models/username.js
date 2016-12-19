const mongoose = require('mongoose'),  
	Schema = mongoose.Schema;

const UsernameSchema = new Schema({  
		username : {
			type : String,
			unique : true
		},
		uid : Schema.Types.ObjectId,
		sid : Schema.Types.ObjectId 
	},
	{
	  timestamps: true
	}
);

module.exports = mongoose.model('Username', UsernameSchema);

