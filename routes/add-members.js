const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const Project = require('../src/models/project');
const User = require('../src/models/user');

let users = [];
adduser = [];

let usersSchema = {
    userID: String,
    username: String,
    name: String,
    role: String,
}

/** 
*  API add-members: Add a user in the project. It also adds project in the user.
*  Note: Multiple user adding functionality is in development mode.
*/
router.post('/add-members', (req, res) => {

    const projectID = req.body.projectID;
    const projectName = req.body.projectName;

    console.log('projectID: ' + projectID)
    console.log('project name: ' + projectName)

    const members = JSON.parse(req.body.member)
    //console.log(members.length);

    if (projectID != undefined && projectName != undefined) {

        // members.forEach(element => {
        //     console.log('\n\n Element to be inserted: ' + JSON.stringify(element));
        //     usersSchema.userID = element.userID;
        //     console.log('\n\n User schema. user ID : ' + usersSchema.userID);
        //     usersSchema.username = element.username;
        //     usersSchema.name = element.name;
        //     usersSchema.role = 'member';

        //     project = {
        //         projectId: projectID,
        //         projectName: projectName,
        //         role: usersSchema.role
        //     }
        //     addProjectToUser(project, usersSchema, resolve, reject);
        // });


        let allMembers = members.map(element => {

            return new Promise((resolve, reject) => {
                console.log('\n\n Element to be inserted: ' + JSON.stringify(element));
                usersSchema.userID = element.userID;
                console.log('\n\n User schema. user ID : ' + usersSchema.userID);
                usersSchema.username = element.username;
                usersSchema.name = element.name;
                usersSchema.role = 'member';

                project = {
                    projectId: projectID,
                    projectName: projectName,
                    role: usersSchema.role
                }

                addProjectToUser(project, usersSchema, resolve, reject);

            });
        });

        Promise.all(allMembers)
            .catch((e) => {
                console.log('something is wrong.' + e);
            })
            .then(() => {
                res.status(200).json({
                    status: true,
                    msg: 'Users successfully added!'
                })
            });

        //members = [];
    } else {
        //not received proper params
    }

    function addProjectToUser(project, usersSchema, resolve, reject) {
        console.log("User ID of user to be added @addProjectToUser: " + usersSchema.userID);

        User.findByIdAndUpdate(usersSchema.userID, { "$push": { "projects": project } }, { 'upsert': true, new: true }, function (err, data) {
            if (err) {
                console.log(err);
                reject();
            } else {
                console.log('\n\n after updating user schema becomes: ' + data + '\n\n');
                console.log('\n\n\n');

                if (data != null || data != undefined) {
                    console.log("schema adding into project: " + JSON.stringify(usersSchema) );
                    Project.findByIdAndUpdate(projectID, { "$push": { "members": usersSchema } }, { 'upsert': true, new: true }, function (err, data) {
                        if (err) {
                            reject();
                            // console.log(err);
                        } else {
                            //console.log('\n\n after inserting member into project it becomes:' + data + '\n\n');
                            if (data != null || data != undefined) {

                                resolve();

                            }
                        }
                    });
                }
            }
        });


    }
});

/**
 * API get-members is used to return all the users registered on the platform.
 * */

router.get('/get-members', (req, res) => {
    User.find({}, function (err, data) {
        if (err) {
            console.log(err);
            res.status(300).json({
                status: false,
                msg: err.getMessage()
            })
        } else {
            if (data != null && data.length > 0) {
                data.forEach(element => {
                    usersSchema.username = element.username;
                    usersSchema.name = element.name;
                    usersSchema.userID = element._id;
                    users.push(usersSchema);
                    usersSchema = {};
                });
                console.log(users);
                if (users != null && users.length > 0) {
                    res.status(200).json({
                        status: true,
                        user: users
                    });
                    users = [];
                }
            }
            else {
                res.status(400).json({
                    status: false,
                    msg: 'No user available.'
                })
            }
        }
    });
});


module.exports = router;