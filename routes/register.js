const express = require('express');
const router = express.Router();
const encrypt = require('../src/utility/encryption');
const User = require('../src/models/user');

router.post('/api/register', (req, res) => {

    const user = new User({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name
    });

    if(user.password != undefined && user.password != null){
        password = encrypt.encryptPassword(user.password);
        user.password = password; 
    }else{
        res.status(301).json({
            status: false,
            msg: 'Something went wrong! Please try again.'
        })
        return;
    }

    user.save(function (err, result) {
        if (err) {
            console.log(user.username)
            if(err.name === 'MongoError' && err.code === 11000){
                res.status(300).json({
                    status: false,
                    msg: `${user.username}` + ' is already in use.'
                })
            }else{
                console.log('something went wrong' + err);
            }
        } else {
            console.log("User added successfully", result);
            res.status(200).json({
                status: true,
                msg: 'User created successfully',
                user: {
                    _id: result._id,
                    username: result.username,
                    projects: result.projects
                }
            });
        }
    })

});


module.exports = router;