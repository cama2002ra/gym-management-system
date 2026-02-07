const express = require('express');
const router = express.Router();
const {
    scheduleWorkout,
    getAllWorkouts,
    getWorkout,
    updateWorkout,
    deleteWorkout
} = require('../controllers/workoutController');

router.route('/')
    .post(scheduleWorkout)
    .get(getAllWorkouts);

router.route('/:id')
    .get(getWorkout)
    .put(updateWorkout)
    .delete(deleteWorkout);

module.exports = router;
