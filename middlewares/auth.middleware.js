import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Token topilmadi" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token topilmadi" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token yaroqsiz" });
    }
};

export default authMiddleware;
