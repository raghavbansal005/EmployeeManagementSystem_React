const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('./MongoDB/database.js');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/EmployeeData', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error:', err));

app.use(bodyParser.json());
app.use(cors());

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email ID and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid Email ID or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch)
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Email ID or password' });
        }

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Error logging in" });
    }
});

app.post('/signup', async (req, res) => {
    const { username, tel, email, password, confirmPassword } = req.body;

    if (!username || !tel || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!/^\d{10,12}$/.test(tel)) {
        return res.status(400).json({ error: 'Phone number must be 10 to 12 digits' });
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        return res.status(400).json({ error: 'Email is invalid' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        return res.status(400).json({
            error: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
        });
    }

    try {
        const hashPassword = await bcrypt.hash(password, 10);
        console.log(hashPassword)
        const newUser = new User({ username, tel, email, password: hashPassword });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ error: 'Error signing up' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
