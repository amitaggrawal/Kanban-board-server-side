const express = require('express');
const router = express.Router();

const Project = require('../src/models/project');
const User = require('../src/models/user');

let users = [];

let usersSchema = {
    userID: String,
    username: String,
    name: String,
    role: String,
}
router.post('/api/add-members', (req, res) => {

    const projectID = req.body.projectID;
    const projectName = req.body.projectName;

    const userID = req.body.userId;
    const username = req.body.username;
    const name = req.body.name;
    const userrole = req.body.role;

    console.log(projectID);
    usersSchema.userID = userID;
    usersSchema.username = username;
    usersSchema.name = name;
    usersSchema.role = userrole;

    Project.findByIdAndUpdate(projectID, { "$push": { "members": usersSchema } }, { 'upsert': true }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            project = {
                projectId: projectID,
                projectName: projectName,
                role: userrole
            }
            console.log('after successfully insertion project adding project to user', project);

            User.findByIdAndUpdate(userID, { "$push": { "projects": project } }, { 'upsert': true }, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                    console.log('\n\n\n');
                    res.status(200).json({
                        status: true,
                        msg: "User added successfully"
                    });
                }
            });
        }
    })
});

router.get('/api/get-members', (req, res) => {
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
})
module.exports = router;