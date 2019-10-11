const express = require('express');
const router = express.Router();

const sprintModal = require('../src/models/sprint');
const Project = require('../src/models/project');

/** This api is used when user creates sprint directly in the software and is not uploading the excel sheet. */
router.post('/api/add-sprint', function (req, res, next) {
    console.log(req.body);
    var sprint = new sprintModal();

    sprint.sprintName = req.body.SprintName;
    const projectID = req.body.projectID;
    sprint.sprintDescription = req.body.SprintDescription;
    sprint.noOfDays = req.body.noOfDays;
    sprint.projectID = projectID;
    sprint.createdOn = new Date().getTime();
    sprint.stories = req.body.stories;

    const sprintDetails = {
        sprintID: Object,
        sprintName: sprint.sprintName
    }

    sprint.save(function (err, response) {
        if (err) {
            console.log(err.message);
            console.log('something went wrong');
        } else {
            console.log(response);
            sprintDetails.sprintID = response._id;

            Project.findOneAndUpdate({ "_id": projectID }, { "$push": { "sprints": sprintDetails } }, { 'upsert': true }, function (err, data) {

                res.status(200).json({
                    status: true,
                    msg: 'File uploaded successfully',
                    //project Id under which this file is uploaded.
                    project_id: data._id,
                    sprint_id: response._id

                })
                return;
            })
        }
    })
});

module.exports = router;