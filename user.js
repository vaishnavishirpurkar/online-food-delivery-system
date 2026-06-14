const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../database/users.json');

// Helper to read users.json
const readUsers = () => JSON.parse(fs.readFileSync(usersFilePath, 'utf-8') || '[]');
// Helper to write users.json
const writeUsers = (data) => fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2));

// Register User
router.post('/register', (req, res) => {
    const { name, email, password, role } = req.body; // role can be: customer, admin, delivery
    const users = readUsers();

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: "Email already exists!" });
    }

    const newUser = { id: "user_" + Date.now(), name, email, password, role: role || 'customer' };
    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: "User registered successfully!", user: newUser });
});

// Login User
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password!" });
    }

    res.status(200).json({ message: "Login successful!", user });
});

module.exports = router;