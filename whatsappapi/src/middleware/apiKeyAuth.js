const User = require('../models/User');

const apiKeyAuth = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ success: false, message: 'API key required (x-api-key header)' });
    }

    try {
        const user = await User.findOne({ apiKey });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid API key' });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error during API key validation' });
    }
};

module.exports = apiKeyAuth;
