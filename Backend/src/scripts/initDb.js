require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Meeting = require('../models/Meeting');

const initializeDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await User.deleteMany({});
        await Meeting.deleteMany({});

        // Create test user
        const user = await User.create({
            email: 'test@example.com',
            password: 'password123'
        });

        // Create sample meetings
        await Meeting.create([
            {
                title: 'IBM Partnership Kickoff',
                date: new Date('2024-01-18T10:00:00Z'),
                venue: 'Online (Zoom)',
                participants: [
                    { name: 'John Doe', email: 'john@ibm.com' },
                    { name: 'Sarah Smith', email: 'sarah@ibm.com' }
                ],
                summary: 'Discussed partnership terms for IBM Cloud services',
                actionPoints: [
                    {
                        description: 'Share pricing structure',
                        assignedTo: 'john@ibm.com',
                        dueDate: new Date('2024-01-20'),
                        status: 'pending'
                    }
                ],
                createdBy: user._id
            }
        ]);

        console.log('Database initialized with sample data');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

initializeDb(); 