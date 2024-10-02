const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1]; // Usually Bearer token comes like this: Bearer <token>


    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
}

module.exports = authMiddleware;