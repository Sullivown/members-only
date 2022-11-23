const async = require('async');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');

exports.user_detail = function (req, res, next) {
	async.parallel(
		{
			user(cb) {
				User.findById(req.params.id).exec(cb);
			},
		},
		{
			posts(cb) {
				Post.find({ user: req.params.id }).exec(cb);
			},
		}
	);
};

exports.user_create_get = function (req, res, next) {
	res.render('user_form', { title: 'Sign Up' });
};

exports.user_create_post = [
	body('first_name')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must enter a first name')
		.escape(),
	body('last_name')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must enter a last name')
		.escape(),
	body('username')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must enter a username')
		.escape(),
	body('password')
		.trim()
		.isLength({ min: 1 })
		.withMessage('You must enter a password')
		.escape(),
	body('password_confirm')
		.trim()
		.custom((value, { req }) => value === req.body.password)
		.withMessage('Passwords do not match')
		.escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
			if (err) {
				return next(err);
			}
			const user = new User({
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				username: req.body.username,
				password: hashedPassword,
			});

			if (!errors.isEmpty()) {
				res.render('user_form', {
					title: 'Sign Up',
					user,
					errors: errors.array(),
				});
				return;
			}

			user.save((err) => {
				if (err) {
					return next(err);
				}
				res.redirect('/');
			});
		});
	},
];

exports.user_login_get = function (req, res, next) {
	res.render('login_form', { title: 'Log-in' });
};

exports.user_login_post = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/log-in',
	failureMessage: true,
});

exports.user_logout_post = (req, res, next) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
};
