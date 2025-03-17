const jwt = require('jsonwebtoken');
// const SECRET_KEY = "your_secret_key";

// exports.verifyToken = (req, res, next) => {
//     const token = req.headers['authorization'];
//     if (!token) {
//         return res.status(403).json({ message: "Token required" });
//     }

//     jwt.verify(token, process.env.JWT, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: "Invalid token" });
//         }
//         req.user = decoded; // Attach user details to request
//         next();
//     });
// };


exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token

    try {
        const decoded = jwt.verify(token, process.env.JWT);
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
