const express = require('express');
const router = express.Router();

const validateRegisterInput = require('../../validation/registerValidator');
const validateLoginInput = require('../../validation/loginValidator');
const User = require('../../models/UserSchema');
const UserService = require('../../services/user/service');

const UserObj = new UserService();
router.post('/register', async (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	try {
		const response = await UserObj.Register(req.body);
		res.json(response);
	} catch (err) {
		res.json(err);
	}
});

router.post('/login', async (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	try {
		const response = await UserObj.Login(req.body);
		res.json(response);
	} catch (err) {
		res.json(err);
	}
});

module.exports = router;
