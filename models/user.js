//import reference to mongoose and bcrypt
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//need an alias for the mongoose.Schema
var Schema = mongoose.Schema; //like a shortcut

//define our user Schema
var UserSchema = new Schema({
	username: String,
	password: String,
	email: String,
	displayName: String,
	salt: String,
	provider: String,
	providerId: String,
	providerData: {},
	created: Number,
	updated: Number
}, {
	collection: 'userInfo'
});

//generate a hash
UserSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//check to see if password is valid
UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);