const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

require('dotenv').config();

const User = require('./models/user');

const indexRouter = require('./routes/index');
const signUpRouter = require('./routes/sign-up');
const loginRouter = require('./routes/log-in');
const logoutRouter = require('./routes/log-out');

const app = express();

// Set up mongoose connection
const mongoDB = process.env.CONNECT;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// passport and bcrypt Setup
passport.use(
	new LocalStrategy((username, password, done) => {
		User.findOne({ username: username }, (err, user) => {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					message: 'Incorrect username or password',
				});
			}
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					// passwords match! return user
					return done(null, user);
				} else {
					// passwords do not match!
					return done(null, false, {
						message: 'Incorrect username or password',
					});
				}
			});
		});
	})
);

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

app.use(logger('dev'));
app.use(express.json());
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
	if (req.isAuthenticated()) {
		res.locals.user = req.user;
	}
	next();
});

app.use('/', indexRouter);
app.use('/sign-up', signUpRouter);
app.use('/log-in', loginRouter);
app.use('/log-out', logoutRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
