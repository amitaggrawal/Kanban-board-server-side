const mongoose = require('mongoose');

const productBacklogSchema = new mongoose.Schema({
    pbName:{
        type: String,
        unique: true
    },
    noOfDays: Number,
    pbDescription: {
        type: String
    },
    createdOn: Date,
    fileName: String,
    features:{
        type: [],
    },
    projectID: String
})

module.exports = mongoose.model('productbacklog', productBacklogSchema);