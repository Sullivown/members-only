const Post = require('../models/post');
const User = require('../models/user');

const async = require('async');
const { body, validationResult } = require('express-validator');

exports.post_list = function (req, res, next) {
	Post.find()
		.sort({ creation_date: -1 })
		.populate('user')
		.exec(function (err, list_posts) {
			if (err) {
				next(err);
			}
			res.render('index', { title: 'Home', post_list: list_posts });
		});
};

exports.post_create_post = [
	body('post_title')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must enter a title')
		.escape(),
	body('post_message')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must enter a message')
		.escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		const post = new Post({
			title: req.body.post_title,
			message: req.body.post_message,
			user: req.session.passport.user,
		});

		if (!errors.isEmpty()) {
			res.render('/', {
				title: 'Home',
				post,
				errors: errors.array(),
			});
			return;
		}

		post.save((err) => {
			if (err) {
				return next(err);
			}
			res.redirect('/');
		});
	},
];

exports.post_delete = function (req, res, next) {
	Post.findByIdAndDelete(req.body.post_id, function (err, docs) {
		if (err) {
			next(err);
		} else {
			res.redirect('/');
		}
	});
};
