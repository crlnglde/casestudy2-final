// authRoute.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CustomerM = require('../models/customerSchema.js');

const router = express.Router();

// Route to handle registration
router.post('/signup', async (req, res) => {
    const { firstName, lastName, username, password } = req.body;

    try {
        const existingCustomer = await CustomerM.findOne({ username });
        if (existingCustomer) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newCustomer = new CustomerM({ firstName, lastName, username, password: hashedPassword });
        await newCustomer.save();

        res.json({ message: "User registered successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Route to handle login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const customer = await CustomerM.findOne({ username });
        if (!customer) {
            return res.status(400).json({ message: "Customer does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, customer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Username or Password is incorrect" });
        }

        const token = jwt.sign({ id: customer._id }, "secret");
        res.json({ token, customerID: customer._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
