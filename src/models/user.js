const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true,
        required: true,
    },
   
    password: {
        type: String,
        required: true
    },

    name: String,

    projects:{
        type: Array,
    }
});

//compiling model from schema
module.exports = mongoose.model('User', userSchema);
