const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput(data) {
	let errors = {};
	// Convert empty fields to an empty string so we can use validator functions
	Object.keys(data).map(function(key, index) {
		const item = data[key];
		if (isEmpty(item)) data[key] = '';
		else data[key] = item;
	});

	// Name checks
	if (Validator.isEmpty(data.name)) {
		errors.name = 'Name field is required';
	}
	// Email checks
	if (Validator.isEmpty(data.email)) {
		errors.email = 'Email field is required';
	} else if (!Validator.isEmail(data.email)) {
		errors.email = 'Email is invalid';
	}
	// Password checks
	if (Validator.isEmpty(data.password)) {
		errors.password = 'Password field is required';
	}
	if (Validator.isEmpty(data.password2)) {
		errors.password2 = 'Confirm password field is required';
	}
	if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.password = 'Password must be at least 6 characters';
	}
	if (!Validator.equals(data.password, data.password2)) {
		errors.password2 = 'Passwords must match';
	}
	return {
		errors,
		isValid: isEmpty(errors)
	};
};
