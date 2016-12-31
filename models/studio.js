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
		place : {
			type : Object,
			required : true
		},
		showreelURL : {
			type : String,
			required : false 
		},
		description : {
			type : String,
			required : true
		},
		email : {
			type : String
		},
		likes : {
			type : Number,
			default : 0
		},
		views : {
			type : Number,
			default : 0
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
		},
		thumbnail : {
			type : []
		}	
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Studio', StudioSchema);

