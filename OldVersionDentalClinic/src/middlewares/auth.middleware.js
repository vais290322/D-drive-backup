const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log("token : ", token);
        
        if (!token) {
            return res.json({
                status: 401,
                message: "User not authenticated",
                success: false
            });
        }

        const decode = await jwt.verify(token, process.env.SECRET);
        if (!decode) {
            return res.json({
                status: 401,
                message: "Token invalid",
                success: false
            });
        }

        req.id = decode.userId;
        next();

    } catch (error) {
        console.log("Error in auth middleware file: ", error);
    }
};

module.exports = isAuthenticated;
