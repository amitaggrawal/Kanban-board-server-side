const express = require('express');
const router = express.Router();
const User = require('../src/models/user');
const ObjectId = require('mongodb').ObjectID;
const Project = require('../src/models/project');

/** This api is used to remove the members already added in a project */
router.post('/api/modify-user', (req, res) => {
    let projectID = req.body.projectID;
    let userID = req.body.userID;
    let username = req.body.username;

    console.log(projectID);
    console.log(userID);
    console.log(username);

    //Delete a project from user; i.e., removing a user from a project
    User.updateOne(
        { "_id": userID },
        { $pull: { "projects": { "projectId": projectID } } }, { safe: true, new: true, multi: true }, function (err, data) {
            if (err) {
                console.log('something went wrong!' + err);
            } else {
                //Update query does not return updated record. It returns no of records updated. 
                //{ n: 1, nModified: 0, ok: 1 }
                console.log(data);
                console.log('deleting user...')
                if (data.nModified == 1) {
                    //Remove user from project document;Î
                    deleteUserFromProject(projectID, username, res);
                }
            }
        });
});

function deleteUserFromProject(projectID, username, res) {
    Project.findOneAndUpdate(
        { "_id": projectID }, 
        { $pull: { "members": {"username" : username} } }, { safe: true, new: true }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
                console.log('came here');

                res.status(200).json({
                    status: true,
                    msg: 'Users Removed Successfully!'
                })

            }
        }
    )
}


// updating a member role in project

/* User.updateOne(
    { "_id": userID, "owner.projectId": ObjectId(projectID) },
    { $set: { "owner.$.role": "member"}}, 
    { safe: true, new: true }, function (err, data) {
        if(err){
            console.log(err);
        }else{
            console.log(data);
        }
    }
) */
module.exports = router;