const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recordedAt: {
        type: Date,
        default: Date.now
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [0, 'Weight must be a positive number']
    },
    bodyFatPercentage: {
        type: Number,
        min: [0, 'Body fat percentage must be a positive number']
    },
    muscleMass: {
        type: Number,
        min: [0, 'Muscle mass must be a positive number']
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Progress', progressSchema);
