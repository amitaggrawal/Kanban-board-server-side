const express = require('express');
const User = require('../src/models/user');
const router = express.Router();

/** This api returns all the projects of a particular user. */
router.post('/api/get-projects', (req, res) => {
    const username = req.body.username;
    User.find({"username": username}, function(err, data) {
        if(err){
            console.log(err);

        }else if(data.length == 0){
            res.status(300).json({
                status: false,
                msg: 'No such user exists'
            });
            console.log('user not found');
        }else{
            console.log(data);
            res.status(200).json({
                status: true,
                projects: data[0].projects
            })
        }
    });
});

module.exports = router;