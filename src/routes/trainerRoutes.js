const express = require('express');
const router = express.Router();
const {
    createTrainer,
    getAllTrainers,
    getTrainer,
    updateTrainer,
    deleteTrainer
} = require('../controllers/trainerController');

router.route('/')
    .post(createTrainer)
    .get(getAllTrainers);

router.route('/:id')
    .get(getTrainer)
    .put(updateTrainer)
    .delete(deleteTrainer);

module.exports = router;
