const jwt = require('jsonwebtoken');
const User = require('../model/User');

const createToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log("user: ", username, password)

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = createToken(user);
        res.json({ token, user: { username: user.username, role: user.role, name: user.name } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.register = async (req, res) => {
    const { username, password, name } = req.body;

    try {
        const user = await User.create({ username, password, name });
        const token = createToken(user);
        res.status(201).json({ token, user: { username: user.username, role: user.role, name: user.name } });
    } catch (err) {
        res.status(500).json({ message: 'User creation failed', error: err.message });
    }
};
