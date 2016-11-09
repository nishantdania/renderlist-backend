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
		email : {
			type : String
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
		isStudio : {
			type : Boolean,
			default : false,
			required : true
		},
		isVerified : {
			type : Boolean,
			default : false
		 },
		_user : {
			type : Schema.Types.ObjectId,
			required : true
		}	
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Studio', StudioSchema);

