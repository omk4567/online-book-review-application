const express = require('express');
const router = express.Router();
const User = require('../models/userModel');  // Make sure this path is correct
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
require('dotenv').config();  
const jwtSecret = process.env.JWT_SECRET; 

// Your registration or other routes
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({   
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error registering user' });
    }
});    

// Login Route
router.post('/login', async (req, res) => {
    const { email } = req.body;
    const password = req.body.password.trim(); 

    try {
        // Find the user by email
        const user = await User.findOne({ email });          
        console.log(user); 
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password); 
        // if (!isMatch) {
        //     return res.status(401).json({ error: 'Invalid credentials' });
        // }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, jwtSecret , { expiresIn: '1h' }); 

        // Send the token back to the client
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
 

module.exports = router;   
     

