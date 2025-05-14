import jwt from "jsonwebtoken";

const authenticateAdmin = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "Access Denied! No Token Provided" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

export { authenticateAdmin };