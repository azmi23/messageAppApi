/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passwordHash  = require('machinepack-passwords');

module.exports = {
	doRegister: function(req, res){
		if (_.isUndefined(req.param('email'))) {
	      return res.json({message: 'an email address must required', code: '400'});
	    }

    if (_.isUndefined(req.param('password'))) {
			return res.json({message: 'a password address must required', code: '400'});
    }

    if (req.param('password').length < 6) {
			return res.json({message: 'Password must be at least 6 characters!', code: '400'});
    }

    if (_.isUndefined(req.param('username'))) {
			return res.json({message: 'A username is required!', code: '400'});
    }

    // username must be at least 6 characters
    if (req.param('username').length < 6) {
			return res.json({message: 'Username must be at least 6 characters!', code: '400'});
    }

    // Username must contain only numbers and letters.
    if (!_.isString(req.param('username')) || req.param('username').match(/[^a-z0-9]/i)) {
			return res.json({message: 'Invalid username: must consist of numbers and letters only.', code: '400'});
    }

		passwordHash.encryptPassword({
			password: req.param('password'),
		}).exec({
			error: function(err){
				return res.serverError(err);
			},
			success: function(result){
				var options = {};
				options.email = req.param('email');
				options.username = req.param('username');
				options.password = result;
				options.deleted = false;
		    options.banned = false;


				User.create(options).exec(function(err, createdUser) {
					if(err){
						console.log('the error is', err.invalidAttributes);

						if(err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule==='unique'){
							return res.json({message: 'an email already exists', code: '400'});
						}
						if(err.invalidAttributes && err.invalidAttributes.username && err.invalidAttributes.username[0] && err.invalidAttributes.username[0].rule==='unique'){
							return res.json({message: 'an username already exists', code: '400'});
						}

						return res.negotiate(err);
					}

					req.session.userId = createdUser.id;
					console.log("username : ", options.username);

					return res.json({message: 'user created', code: '201'});
				});
			}
		});


	},

	doLogin: function(req, res){
		User.findOne({where:{username: req.param('username')}
			// or:[
			// 	{username: req.param('username')},
			// 	{email: req.param('email')}
			// ]
		}, function foundUser(err, createdUser){
			if(err){
				return res.negotiate(err);
			}
			if(!createdUser){
					return res.json({message: 'user not found'});
			}

			passwordHash.checkPassword({
				passwordAttempt: req.param('password'),
				encryptedPassword:createdUser.password
			}).exec({
				error: function(err){
					return res.negotiate(err);
				},
				incorrect: function(){
					return res.json({message:'wrong password'});
				},
				success: function(){
					if(createdUser.deleted){
						return res.json({message: 'User Account has been deleted'});
					}

					if(createdUser.banned){
						return res.json({message: 'user has been banned'});
					}

					req.session.id=createdUser.id;

					res.json({message:'you logged in', code:'201'});
				}
			});
		});
	}
};
