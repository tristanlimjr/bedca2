const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || "ponrev-rundIv-3myvno-bed-ca2-seCuRed";

module.exports.register = async (req, res) => {
    const data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        skillpoints: 0,
        level: 1
    }

    if (!data.username || !data.email || !data.password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        userModel.findByUsername(data.username, async (err, existingUser) => {
            if (err) return res.status(500).json({ message: "Database error" });

            if (existingUser !== null) {
                return res.status(400).json({ message: "Username already exists" });
            }

            const hashedPassword = await bcrypt.hash(data.password, 12);
            const userData = { 
                username: data.username, 
                email: data.email, 
                password: hashedPassword, 
                skillpoints: 0, 
                level: 1
            };

            userModel.insertSingle(userData, (insertErr) => {
                if (insertErr) return res.status(500).json({ message: "Error creating user" });

                res.status(201).json({ message: "User registered successfully" });
            });
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        userModel.findByUsername(username, async (err, user) => {
            if (err) return res.status(500).json({ message: "Database error" });
            if (!user) return res.status(400).json({ message: "User not found" });

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: "Invalid password" });
            }

            const token = jwt.sign({ user_id: user.user_id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ token, user_id: user.user_id, username: user.username });
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports.getUserData = (req, res) => {
    const { user_id, username } = req.user;

    userModel.selectById(user_id, (error, user) => {
        if (error) return res.status(500).json({ message: "Database error" });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ 
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            skillpoints: user.skillpoints,
            level: user.level
        });
    });
};
