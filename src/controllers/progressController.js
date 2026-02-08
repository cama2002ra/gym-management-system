const Progress = require('../models/progressModel');

const buildWeightLossLeaderboard = async (limit) => {
    const leaderboard = await Progress.aggregate([
        { $sort: { recordedAt: 1 } },
        {
            $group: {
                _id: '$userId',
                firstWeight: { $first: '$weight' },
                lastWeight: { $last: '$weight' },
                firstRecordedAt: { $first: '$recordedAt' },
                lastRecordedAt: { $last: '$recordedAt' }
            }
        },
        {
            $addFields: {
                weightLoss: { $subtract: ['$firstWeight', '$lastWeight'] }
            }
        },
        { $sort: { weightLoss: -1 } },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 0,
                userId: '$_id',
                name: '$user.name',
                weightLoss: 1,
                firstWeight: 1,
                lastWeight: 1,
                firstRecordedAt: 1,
                lastRecordedAt: 1
            }
        },
        ...(limit ? [{ $limit: limit }] : [])
    ]);

    return leaderboard;
};

// Create new progress entry
exports.createProgress = async (req, res) => {
    try {
        const progress = await Progress.create(req.body);
        res.status(201).json({
            success: true,
            data: progress
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all progress entries for a user
exports.getUserProgress = async (req, res) => {
    try {
        const progressEntries = await Progress.find({ userId: req.params.userId })
            .sort({ recordedAt: 1 });

        res.status(200).json({
            success: true,
            count: progressEntries.length,
            data: progressEntries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get evolution summary for a user
exports.getUserEvolution = async (req, res) => {
    try {
        const [firstEntry] = await Progress.find({ userId: req.params.userId })
            .sort({ recordedAt: 1 })
            .limit(1);

        const [lastEntry] = await Progress.find({ userId: req.params.userId })
            .sort({ recordedAt: -1 })
            .limit(1);

        if (!firstEntry || !lastEntry) {
            return res.status(404).json({
                success: false,
                error: 'Progress data not found for this user'
            });
        }

        const toNumber = (value) => (value === undefined || value === null ? null : value);
        const firstBodyFat = toNumber(firstEntry.bodyFatPercentage);
        const lastBodyFat = toNumber(lastEntry.bodyFatPercentage);
        const firstMuscleMass = toNumber(firstEntry.muscleMass);
        const lastMuscleMass = toNumber(lastEntry.muscleMass);

        const evolution = {
            firstEntry,
            lastEntry,
            weightChange: lastEntry.weight - firstEntry.weight,
            bodyFatChange: firstBodyFat !== null && lastBodyFat !== null ? lastBodyFat - firstBodyFat : null,
            muscleMassChange: firstMuscleMass !== null && lastMuscleMass !== null ? lastMuscleMass - firstMuscleMass : null
        };

        res.status(200).json({
            success: true,
            data: evolution
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get leaderboard based on weight loss
exports.getLeaderboard = async (req, res) => {
    try {
        const limit = Number.parseInt(req.query.limit, 10);
        const leaderboard = await buildWeightLossLeaderboard(Number.isNaN(limit) ? undefined : limit);

        res.status(200).json({
            success: true,
            count: leaderboard.length,
            data: leaderboard
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get rank for a user based on weight loss
exports.getUserRank = async (req, res) => {
    try {
        const leaderboard = await buildWeightLossLeaderboard();
        const userIndex = leaderboard.findIndex(
            (entry) => entry.userId.toString() === req.params.userId
        );

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'User rank not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                rank: userIndex + 1,
                total: leaderboard.length,
                entry: leaderboard[userIndex]
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
