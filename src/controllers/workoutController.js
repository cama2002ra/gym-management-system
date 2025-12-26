const Workout = require('../models/workoutModel');
const User = require('../models/userModel');
const Trainer = require('../models/trainerModel');

// Schedule workout with validation
exports.scheduleWorkout = async (req, res) => {
    try {
        const { userId, trainerId, scheduledDateTime, workoutType } = req.body;
        
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

// ... Add other CRUD operations similar to userController.js