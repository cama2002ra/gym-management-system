const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
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
    specialization: [{
        type: String,
        enum: ['yoga', 'cardio', 'strength', 'pilates', 'cross-fit']
    }],
    experienceYears: {
        type: Number,
        min: [1, 'Experience must be at least 1 year']
    },
    hourlyRate: {
        type: Number,
        required: [true, 'Hourly rate is required'],
        min: [10, 'Hourly rate must be at least 10']
    },
    available: {
        type: Boolean,
        default: true
    },
    certifications: [{
        type: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Trainer', trainerSchema);