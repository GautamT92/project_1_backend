const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const SALT = 10;

const createHashedPassword = async (password) =>
	await new Promise((resolve, reject) => {
		bcrypt.hash(password, SALT, function(err, hash) {
			if (err) reject(err);
			resolve(hash);
		});
	});
const validatePassword = async (password1, password2) => {
	const isEqual = await bcrypt.compare(password1, password2);
	return isEqual;
};
const createSignedToken = async (payload) => {
	const token = await jwt.sign(payload, keys.secretOrKey, {
		expiresIn: 31556926
	});
	return token;
};
module.exports = {
	createHashedPassword,
	createSignedToken,
	validatePassword
};
