const express = require('express');
const mongoose = require('mongoose');
const User = require('../src/models/user');
const encrypt = require('../src/utility/encryption');
var router = express.Router();

router.post('/api/login/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.find({ "username": username }, function (err, data) {

        if (err) {
            console.log(err);
        } else if (data.length == 0) {

            res.status(300).json({
                status: false,
                msg: 'No such user exists'
            });
            console.log('No data found');
        } else {
            console.log(data[0].password);
            data.forEach(element => {
                if (encrypt.compare(password, element.password)) {
                    res.status(200).json({
                        status: true,
                        msg: 'User found',
                        user: {
                            _id: element._id,
                            name: element.name,
                            username: element.username,
                            projects: element.projects
                        }

                    });
                    return;
                } else {
                    // wrong password
                    res.status(300).json({
                        status: false,
                        msg: 'Incorrect Username or Password'
                    })
                }
            });
        }
    });
});

module.exports = router;