const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const User = require('../../models/UserSchema');
class UserService {
	Register = async (params) => {
		const { email, password } = params;
		const user = await User.findOne({ email });
		if (user) {
			throw { message: 'User already exists' };
		} else {
			let newUser = new User(params);
			const hashedPassword = await new Promise((resolve, reject) => {
				bcrypt.hash(password, saltRounds, function(err, hash) {
					if (err) reject(err);
					resolve(hash);
				});
			});
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
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (isPasswordMatch) {
			const payload = {
				id: user._id,
				name: user.name
			};
			try {
				const token = await jwt.sign(payload, keys.secretOrKey, {
					expiresIn: 31556926
				});
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
