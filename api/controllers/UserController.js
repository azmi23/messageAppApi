/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	signup: function(req, res){
		if (_.isUndefined(req.param('email'))) {
	      return res.badRequest('An email address is required!');
	    }

	    if (_.isUndefined(req.param('password'))) {
	      return res.badRequest('A password is required!');
	    }

	    if (req.param('password').length < 6) {
	      return res.badRequest('Password must be at least 6 characters!');
	    }

	    if (_.isUndefined(req.param('username'))) {
	      return res.badRequest('A username is required!');
	    }

	    // username must be at least 6 characters
	    if (req.param('username').length < 6) {
	      return res.badRequest('Username must be at least 6 characters!');
	    }

	    // Username must contain only numbers and letters.
	    if (!_.isString(req.param('username')) || req.param('username').match(/[^a-z0-9]/i)) {
	      return res.badRequest('Invalid username: must consist of numbers and letters only.');
	    }
		var options = {};
		options.email = req.param('email');
		options.username = req.param('username');
		options.password = req.param('password');
		options.deleted = false;
    options.banned = false;
		console.log("username : ", options.username);

		User.create(options).exec(function(err, createdUser) {
			if(err){
				console.log('the error is', err.invalidAttributes);

				if(err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule==='unique'){
					return res.alreadyInUse(err);
				}

				if(err.invalidAttributes && err.invalidAttributes.username && err.invalidAttributes.username[0] && err.invalidAttributes.username[0].rule==='unique'){
					return res.alreadyInUse(err);
				}

				return res.negotiate(err);
			}

			req.session.userId = createdUser.id;

			return res.json({
				username: createdUser.username
			});
		});
	}
};
