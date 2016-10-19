const mongoose = require('mongoose'),  
	Schema = mongoose.Schema;

const StudioSchema = new Schema({  
		name : {
			type : String,
			required : true
		},		
		websiteURL : {
			type : String,
			lowercase : true,
			required : true
		},
		city : {
			type : String,
			required : true
		},		
		showreelURL : {
			type : String,
			required : true
		},
		description : {
			type : String,
			required : true
		},
		likes : {
			type : Number
		},
		views : {
			type : Number
		},
		tags : {
			type : [String]
	   	},
		_user : {
			type : Schema.Types.ObjectId,
			ref : 'User',
			required : false
		}	
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Studio', StudioSchema);

