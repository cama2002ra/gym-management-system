const Trainer = require('../models/trainerModel');

// Create new trainer
exports.createTrainer = async (req, res) => {
    try {
        const trainer = await Trainer.create(req.body);
        res.status(201).json({
            success: true,
            data: trainer
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all trainers with filters
exports.getAllTrainers = async (req, res) => {
    try {
        const { available, specialization } = req.query;
        const filter = {};
        
        if (available) filter.available = available === 'true';
        if (specialization) filter.specialization = specialization;
        
        const trainers = await Trainer.find(filter);
        res.status(200).json({
            success: true,
            count: trainers.length,
            data: trainers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get single trainer
exports.getTrainer = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id);
        if (!trainer) {
            return res.status(404).json({
                success: false,
                error: 'Trainer not found'
            });
        }
        res.status(200).json({
            success: true,
            data: trainer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update trainer
exports.updateTrainer = async (req, res) => {
    try {
        const trainer = await Trainer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!trainer) {
            return res.status(404).json({
                success: false,
                error: 'Trainer not found'
            });
        }
        res.status(200).json({
            success: true,
            data: trainer
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete trainer
exports.deleteTrainer = async (req, res) => {
    try {
        const trainer = await Trainer.findByIdAndDelete(req.params.id);
        if (!trainer) {
            return res.status(404).json({
                success: false,
                error: 'Trainer not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Trainer deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
