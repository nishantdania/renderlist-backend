const mongoose = require('mongoose'),  
	Schema = mongoose.Schema,
	SALT_FACTOR = 10,
	bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({  
		facebook: {
			id: { type : String, unique : true },
			name : String,
			email : String,
			token : String,
			profilePhoto : String
		},
		google : {
			id: { type : String, unique : true },
			name : String,
			email : String,
			token : String,
			profilePhoto : String
		},
		studio : {
			type : Boolean,
			default : false
		}
	},
	{
	  timestamps: true
	}
);

module.exports = mongoose.model('User', UserSchema);

