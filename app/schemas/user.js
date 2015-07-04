var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	email: {
		unique: true,
		type: String
	},
	password: String,
	userName: String,
	firstName: String,
	lastName: String,
	// 1: superuser
	superUserFlag: {
		type: Number,
		default: 0
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	firstUsedAt: {
		type: Date,
		default: Date.now()
	},
	lastUsedAt: {
		type: Date,
		default: Date.now()
	}
});

module.exports = UserSchema;