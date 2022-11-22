const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
	title: { type: String, default: '', required: true },
	message: { type: String, default: '', required: true },
	creation_date: { type: Date, default: Date.now },
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

PostSchema.virtual('url').get(function () {
	return `/post/${this._id}`;
});

module.exports = mongoose.model('Post', PostSchema);
