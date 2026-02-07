const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MongoDB_URI;
        if (!mongoUri) {
            throw new Error('Missing MongoDB connection string. Set MONGODB_URI in .env.');
        }
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
