const express = require('express');
const router = express.Router();
const {
    createProgress,
    getUserProgress,
    getUserEvolution,
    getLeaderboard,
    getUserRank
} = require('../controllers/progressController');

router.post('/', createProgress);
router.get('/user/:userId', getUserProgress);
router.get('/user/:userId/evolution', getUserEvolution);
router.get('/leaderboard', getLeaderboard);
router.get('/rank/:userId', getUserRank);

module.exports = router;
