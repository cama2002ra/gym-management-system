const mongoose = require('mongoose');
const User = require('./src/models/userModel');
const Trainer = require('./src/models/trainerModel');
require('dotenv').config();

const sampleUsers = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        membershipType: 'premium',
        active: true
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 30,
        membershipType: 'elite',
        active: true
    },
    // Add 3 more users
];

const sampleTrainers = [
    {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        specialization: ['strength', 'cardio'],
        experienceYears: 5,
        hourlyRate: 50,
        available: true,
        certifications: ['ACE Certified', 'CPR']
    },
    
];

