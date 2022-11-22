const Post = require('../models/post');
const User = require('../models/user');

const async = require('async');
const { body, validationResult } = require('express-validator');

exports.post_list = function (req, res, next) {
	Post.find()
		.populate('user')
		.exec(function (err, list_posts) {
			if (err) {
				next(err);
			}
			res.render('index', { title: 'Home', post_list: list_posts });
		});
};

exports.post_create_post = function (req, res, next) {};
