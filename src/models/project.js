const mongoose = require('mongoose');

/*
*  @AMITAGGRAWAL on 25th July 2019:
*  Removed separate owner property as it will create difficulty when removing or modifying roles of members.*/
const projectSchema = new mongoose.Schema({

    projectName: {
        type: String,
        unique: true,
        required: true,
    },
    projectDescription: {
        type: String,
        required: true
    },
    owner: { userId: Object, username: String },
    members: [{ name: String, username: String, userID: String, role: String }],
    sprints: {
        type: [],
        default: null,
    },
    artifacts: {
        type: [],
        default: null,
    },
    productBacklog:{
        type: [],
        default: null
    }
});

//compiling model from schema
module.exports = mongoose.model('Project', projectSchema);
