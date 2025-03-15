require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Delete existing admin if exists
        await User.deleteOne({ email: 'admin@example.com' });

        // Create new admin
        const admin = await User.create({
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        console.log('Admin user created:', admin.email);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin(); 