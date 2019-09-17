// this route is called whenerever there is a remove request from frontend.
// it can be either remove user, remove sprint, remove artifact.

const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const Project = require('../src/models/project');
const Sprint = require('../src/models/sprint');

router.post('/api/remove-user', (err, response) => {

});

router.post('/api/remove-sprint', (req, res) => {
    const projectID = req.body.projectID;
    const sprintId = req.body.sprintID;

    //1. remove sprint from project collection. 
    //2. remove sprint from sprint collection.

    Project.updateOne(
        { "_id": projectID },
        { $pull: { sprints: { sprintID: ObjectId(sprintId) } } }, function (err, data) {
            if (err) {
                res.status(300).json({
                    status: false,
                    msg: "Something went wrong. Please try again."
                });
            } else {
                if (removeSprintFromCollection(sprintId)) {
                    //successfully deleted sprint from sprint collection
                    res.status(200).json({
                        status: true,
                        msg: "Sprint removed successfully"
                    });
                } else {

                }
            }
        });

});

function removeSprintFromCollection(sprintID) {
    Sprint.findOneAndRemove({ "_id": sprintID }, (err, response) => {
        if (err) {
            return err;

        } else {
            console.log('remove sorint from collection');
            console.log(response);
            return true;
        }
    });
}

router.post('/api/remove-artifact', (err, response) => {
    const fileID = req.body.artifactID;
    const projectID = req.body.projectID;

    Project.update(
        { "_id": projectID },
        { $pull: { "artifacts": { "fileID": fileID} } },
        function(err, response){
            if(err){
                console.log(err);
            }else{
                console.log(response);
            }
        }
    )
});


router.post('/api/download-artifacts', (req, res) => {

    const fileID = req.body.artifactID;
    const projectID = req.body.projectID;

    console.log(fileID, projectID);

    Project.findById(projectID, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            data.artifacts.forEach(element => {
                console.log(element);
                if (element.fileID == fileID) {
                    console.log('file found');
                    const path = require('path').dirname('/Users/ilpinnovation/Desktop/KanbanBackend/kanban/');
                    console.log(path);

                    res.sendFile(path + '/kanban/uploads/' + `${fileID}`, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    })
                }
            });
        }
    });
});
module.exports = router; 