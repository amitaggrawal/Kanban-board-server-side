const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
    sprintName: {
        type: String,
        unique: true
    },

    noOfDays: Number,
    sprintDescription: {
        type: String,
    },
    stories: {
        type: [],
        ref: 'Story'
    },
    projectID: String,
    createdOn: Date,
});

module.exports = mongoose.model('sprint', sprintSchema);