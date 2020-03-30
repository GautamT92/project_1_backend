const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const User = require('../../models/UserSchema');
const { createHashedPassword, createSignedToken, validatePassword } = require('../../utils/passport');

class UserService {
	Register = async (params) => {
		const { email, password } = params;
		const user = await User.findOne({ email });
		if (user) {
			throw { message: 'User already exists' };
		} else {
			let newUser = new User(params);
			const hashedPassword = await createHashedPassword(password);
			newUser.password = hashedPassword;
			let response = await newUser.save();
			return response;
		}
	};

	Login = async (params) => {
		const { email, password } = params;
		const user = await User.findOne({ email });
		if (!user) {
			throw { message: 'User not found' };
		}
		const isPasswordMatch = await validatePassword(password, user.password);
		if (isPasswordMatch) {
			const payload = {
				id: user._id,
				name: user.name
			};
			try {
				const token = await createSignedToken(payload);
				return {
					success: true,
					user,
					token: 'Bearer ' + token
				};
			} catch (err) {
				throw err;
			}
		} else {
			throw { message: 'Password incorrect' };
		}
	};
}

module.exports = UserService;
