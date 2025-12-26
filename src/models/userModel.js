const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    age: {
        type: Number,
        min: [16, 'Age must be at least 16'],
        max: [100, 'Age cannot exceed 100']
    },
    membershipType: {
        type: String,
        enum: ['basic', 'premium', 'elite'],
        default: 'basic'
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);