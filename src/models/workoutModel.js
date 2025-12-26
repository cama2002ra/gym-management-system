const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    },
    scheduledDateTime: {
        type: Date,
        required: true
    },
    workoutType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    notes: {
        type: String
    },
    duration: {
        type: Number, // in minutes
        default: 60
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);