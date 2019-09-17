const express = require('express');
const router = express.Router();
const User = require('../src/models/user');
const ObjectId = require('mongodb').ObjectID;
const Project = require('../src/models/project');

router.post('/api/modify-user', (req, res) => {
    let projectID = req.body.projectID;
    let userID = req.body.userID;

    console.log(projectID);
    //Delete a project from user; i.e., removing a user from a project
    User.updateOne(
        { "_id": userID },
        { $pull: { "projects": { "projectId": ObjectId(projectID) } } }, { safe: true, new: true }, function (err, data) {
            if (err) {
                console.log('something went wrong!' + err);
            } else {
                //Update query does not return updated record. It returns no of records updated. 
                //{ n: 1, nModified: 0, ok: 1 }
                if (data.nModified == 1) {
                    //Remove user from project document;Î
                    deleteUserFromProject(projectID, userID);
                }
            }
        });
});

function deleteUserFromProject(projectID, userID) {
    Project.findOneAndUpdate(
        { "_id": projectID }, 
        { $pull: { "member": {"userId" : userID} } }, { safe: true, new: true }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
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