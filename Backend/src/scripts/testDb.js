const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Create a test document
        const testSchema = new mongoose.Schema({
            name: String,
            date: { type: Date, default: Date.now }
        });
        
        const Test = mongoose.model('Test', testSchema);
        await Test.create({ name: 'test connection' });
        
        console.log('Test document created successfully');
        
        // Clean up
        await mongoose.connection.dropDatabase();
        console.log('Test database cleaned');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

connectDB(); 