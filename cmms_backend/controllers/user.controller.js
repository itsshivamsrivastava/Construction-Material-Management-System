import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Create a new user
const createAdmin = async (req, res) => {
    const { name, username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
        name,
        username,
        email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
}

// Admin login
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json("User not found");

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) return res.status(400).json("Invalid credentials");
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json(err);
    }
};

// Logout
const logoutAdmin = async (req, res) => {
    try {
        res.clearCookie("access_token", {
            sameSite: "none",
            secure: true,
        }).status(200).json("User has been logged out.");
    } catch (err) {
        res.status(500).json(err);
    }
};

export { createAdmin, loginAdmin, logoutAdmin };