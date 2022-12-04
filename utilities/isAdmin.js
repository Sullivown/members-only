const User = require('../models/user');

module.exports.isAdmin = function(req, res, next) => {
	if(req.user.admin) {
		next()
	}

	else {
		res.status(403).json({msg: 'Forbidden'})
	}

}