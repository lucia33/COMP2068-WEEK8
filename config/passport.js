//define local strategy
var LocalStrategy = require('passport-local').Strategy;

//import the User Model
var User = require('../models/user');

module.exports = function(passport) {
	//serialize
	passport.serializeUser(function(user, done) {
		done(null, user);
	});
	
	//deserialize
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	
	passport.use('local-login', new LocalStrategy({
		passReqToCallback: true
	},
	function(req, username, password, done) {
		//asynchronous process
		process.nextTick(function() {
			User.findOne({
				'Username': username
			}), function(err, user) {
				if(err) {
					return done(err);
				}
				
				//if no valid username is found
				if(!user) {
					return done(null, false, req.flash('loginMessage', 'Incorrect UserName'));
				}
				
				//if no valid password is entered
				if(!user.validPassword(password)) {
					return done(null, false, req.flash('loginMessage', 'Incorrect Password'));
				}
				
				//everything is ok - proceed with login
				return done(null, user); //return user info
			}
		});
	}
	));
	
	//configure registration local strategy
	passport.use('local-registration', new LocalStrategy({
		passReqToCallback: true
	},
	function(req, username, password, done){
		//asynchronous process
		process.nextTick(function(){
			//if the user is not already logged in
			if(!req.user){
				User.findOne({'username': username},
				//if any weird errors
				function(err, user){
					if(err){
						return done(err);
					}
					
					//check if username is already taken
					if(user){
						return done(null, false, req.flash('registerMessage', 'The username is already taken'));
					}
					else {
						//create user
						var newUser = new User(req, body);
						newUser.password = newUser.generateHash(newUser, password);
						newUser.provider = 'local';
						newUser.created = Date.now();
						newUser.updated = Date.now();
						newUser.save(function(err) {
							if(err) {
								throw err;
							}
							else {
								return done(null, newUser);
							}
						});
					}
				}//end of weird error
				);
			}//end of checking log-in status 
			//?????correct place??????
			else {
				//everything is ok - user is registered
				return done(null, req.user);
			}
		});
	}
	));
}