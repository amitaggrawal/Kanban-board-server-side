const mongoose = require('mongoose');

const artifactSchema = new mongoose.Schema({

    projectID: {
        type: String,
        required: true
    },
    artifactStoreFileName:String,
    artifactFileOriginalName: String,
});

module.exports = mongoose.model('Artifact', artifactSchema);