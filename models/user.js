const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true },
	member: { type: Boolean, default: false },
	admin: { type: Boolean, default: false },
	creation_date: { type: Date, default: Date.now },
	last_login: { type: Date, default: Date.now },
});

UserSchema.virtual('url').get(function () {
	return `/user/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);
