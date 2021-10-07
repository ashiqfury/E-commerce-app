const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');

// register
router.post('/register', async (req, res) => {
	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET_KEY),
	});

	try {
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (err) {
		res.status(500).json(err);
	}
});

// login
router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username });
		!user && res.status(401).json('Wrong credectials');

		const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET_KEY);
		const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

		originalPassword !== req.body.password && res.status(401).json('Wrong credectials');
		const { password, ...others } = user._doc; // all docs in mongodb are saved in _doc folder.

		res.status(200).json(others);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
