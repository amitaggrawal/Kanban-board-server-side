const express = require('express');
const router = express.Router();
const User = require('../src/models/user');
const Project = require('../src/models/project');

/** This api is used when someone creates a new project. */

router.post('/api/add-project', (req, res) => {
    const userID = req.body.userId;
    const userName = req.body.username;
    const projectName = req.body.projectName;
    const projectDescription = req.body.projectDescription;

    const project = new Project({
        projectName: projectName,
        projectDescription: projectDescription,
        owner: {
            userId: userID,
            username: userName,
        }
    });

    // const member = {
    //     userId: userID,
    //     username: userName,
    //     role: "owner"
    // }

    // project.members.push(member);

    project.save(function (err, result) {
        if (err) {
            console.log('Something went wrong! ' + err);
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(300).json({
                    status: false,
                    msg: 'Project alredy exists'
                })
            } else {
                console.log('Something went wrong! ' + err);
            }

        } else {
            //add details to user table also.
            projectOwner = {
                projectId: result._id,
                projectName: projectName, //result.projectName,
                role: "owner"
            }


            User.findByIdAndUpdate(userID, { "$push": { "projects": projectOwner } }, { 'upsert': true }, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                    console.log('\n\n\n');
                    res.status(200).json({
                        status: true,
                        msg: "Project added successfully",
                        id: result._id
                    });
                }
            });

        }

        // res.status(200).json({
        //     message: "Handling Post request",
        //     createdUser: user
        // });
    });
});

module.exports = router;