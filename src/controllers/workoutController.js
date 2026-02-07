const Workout = require('../models/workoutModel');
const User = require('../models/userModel');
const Trainer = require('../models/trainerModel');

// Schedule workout with validation
exports.scheduleWorkout = async (req, res) => {
    try {
        const { userId, trainerId, scheduledDateTime, workoutType } = req.body;
        if (!userId || !trainerId || !scheduledDateTime || !workoutType) {
            return res.status(400).json({
                success: false,
                error: 'userId, trainerId, scheduledDateTime, and workoutType are required'
            });
        }
        
        // Check user membership
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        if (!['premium', 'elite'].includes(user.membershipType)) {
            return res.status(400).json({
                success: false,
                error: 'Only premium or elite members can schedule workouts'
            });
        }
        
        // Check trainer availability
        const trainer = await Trainer.findById(trainerId);
        if (!trainer) {
            return res.status(404).json({
                success: false,
                error: 'Trainer not found'
            });
        }
        
        if (!trainer.available) {
            return res.status(400).json({
                success: false,
                error: 'Trainer is not available'
            });
        }
        
        // Check for scheduling conflicts (basic check)
        const existingWorkout = await Workout.findOne({
            $or: [
                { userId, scheduledDateTime },
                { trainerId, scheduledDateTime }
            ]
        });
        
        if (existingWorkout) {
            return res.status(400).json({
                success: false,
                error: 'Scheduling conflict detected'
            });
        }
        
        // Create workout
        const workout = await Workout.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Workout scheduled successfully',
            data: workout
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all workouts with optional filters
exports.getAllWorkouts = async (req, res) => {
    try {
        const { status, userId, trainerId } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (userId) filter.userId = userId;
        if (trainerId) filter.trainerId = trainerId;

        const workouts = await Workout.find(filter)
            .populate('userId', 'name email membershipType')
            .populate('trainerId', 'name email specialization');

        res.status(200).json({
            success: true,
            count: workouts.length,
            data: workouts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get single workout
exports.getWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id)
            .populate('userId', 'name email membershipType')
            .populate('trainerId', 'name email specialization');
        if (!workout) {
            return res.status(404).json({
                success: false,
                error: 'Workout not found'
            });
        }
        res.status(200).json({
            success: true,
            data: workout
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update workout
exports.updateWorkout = async (req, res) => {
    try {
        const workout = await Workout.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!workout) {
            return res.status(404).json({
                success: false,
                error: 'Workout not found'
            });
        }
        res.status(200).json({
            success: true,
            data: workout
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete workout
exports.deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findByIdAndDelete(req.params.id);
        if (!workout) {
            return res.status(404).json({
                success: false,
                error: 'Workout not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Workout deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
