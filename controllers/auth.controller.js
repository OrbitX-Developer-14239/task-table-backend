import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

// Seed admin if not exists
export const seedAdmin = async () => {
    try {
        const existingAdmin = await Admin.findOne({ login: process.env.ADMIN_LOGIN });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            await Admin.create({
                login: process.env.ADMIN_LOGIN,
                password: hashedPassword,
            });
            console.log("Admin yaratildi");
        }
    } catch (error) {
        console.log("Admin seed xatolik:", error.message);
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(400).json({ message: "Login va parol kiritilishi shart" });
        }

        const admin = await Admin.findOne({ login });
        if (!admin) {
            return res.status(401).json({ message: "Login yoki parol noto'g'ri" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Login yoki parol noto'g'ri" });
        }

        const token = jwt.sign(
            { id: admin._id, login: admin.login },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Muvaffaqiyatli kirish",
            token,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi", error: error.message });
    }
};

// Check auth
export const checkAuth = async (req, res) => {
    try {
        return res.status(200).json({ message: "Autentifikatsiya muvaffaqiyatli", admin: req.admin });
    } catch (error) {
        return res.status(500).json({ message: "Server xatoligi" });
    }
};