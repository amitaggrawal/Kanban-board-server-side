const express = require('express');
const multer = require('multer');
const sprintModal = require('../src/models/sprint');
const excelToJSON = require('convert-excel-to-json');
const Project = require('../src/models/project');
const productBacklogModel = require('../src/models/productbacklog');
var router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        var ext = file.originalname.split('.');
        // cb(null, file.originalname + '-' + Date.now() + "." + ext[1])
        cb(null, file.originalname + '-' + Date.now())
    }
})

var upload = multer({
    storage: storage,
})

router.post('/api/upload-sprint-test', upload.single('file'), function (req, res) {
    const type = req.body.type;
    if (type === 'sprint') {
        uploadSprint(req, res);
    } else {
        uploadProductBacklog(req, res);
    }

});


var uploadSprint = function (req, res) {
    const file = req.file;
    //console.log(file);
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    } else if (req.fileValidationError) {
        res.status(300).json({
            status: false,
            msg: 'Invalid file. Please check file type'
        });
    } else {

        const result = excelToJSON({
            sourceFile: `${file.path}`,
            header: {
                // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
                rows: 1 // 2, 3, 4, etc.
            },
            columnToKey: {
                'A': '{{A1}}',
                // 'B': '{{B1}}',
                'B': 'task_id',
                'C': 'task_details',
                'D': 'volunteer',
                'E': 'initial_effort_estimate',
            },
            sheets: ['Sprint 1 Backlog']
        });

        let data = result['Sprint 1 Backlog'];

        var keys = [];

        var temp = {};

        var sprint = new sprintModal();

        sprint.sprintName = req.body.name;
        console.log(sprint.sprintName);
        const projectID = req.body.projectID;
        sprint.sprintDescription = req.body.description;
        sprint.noOfDays = req.body.noOfDays;
        sprint.projectID = projectID;
        sprint.createdOn = new Date().getTime();

        const sprintDetails = {
            sprintID: Object,
            sprintName: sprint.sprintName
        }

        var story = {
            user_story_id: '',
            task: []
        }

        console.log(data);

        data.forEach((element, index) => {

            keys = Object.keys(element);

            if (Object.keys(temp).length > 0) {
                temp['modifiedBy'] = '';
                temp['modifiedAt'] = '';
                temp['stat'] = 'to-do';
                temp['efforts_remaining'] = '';
                temp['user_story_id'] = story.user_story_id;
                sprint.stories.push(temp);
                //story.task.push(temp);
                temp = {};

                if (keys.indexOf('Story #') > -1) {

                    // we have user_story_id in story object but we are not inserting it in DB. To insert it, remove `.task` from story below.
                    if (story.task.length > 0) {
                        // sprint.stories.push(story);

                        story = {};
                        story.user_story_id = '';
                        //story.user_story_description = '';
                        story.task = [];
                    }
                }
            }

            keys.forEach(key => {

                if (key != 'Story #' && key != 'Sprint Backlog Item') {
                    // console.log(element[key]);
                    temp[key] = element[key];
                }
                else if (key == 'Story #') {
                    story.user_story_id = element[key];
                }
                // else if (key == 'Sprint Backlog Item') {

                //     sprint.user_story_description = element[key];
                // }
            });
        });

        if (Object.keys(temp).length > 0) {
            temp['modifiedBy'] = '';
            temp['modifiedAt'] = '';
            temp['stat'] = 'to-do';
            temp['efforts_remaining'] = '';
            temp['user_story_id'] = story.user_story_id;
            sprint.stories.push(temp);
            //story.task.push(temp);
            temp = {};


            if (story.task.length > 0) {
                //sprint.stories.push(story);

                story = {};
                story.user_story_id = '';
                //story.user_story_description = '';
                story.task = [];
            }

        }

        if (sprint.stories.length < 1) {
            res.status(300).json({
                status: false,
                msg: 'File content not valid!'
            });
            return;

        }
        sprint.save(function (err, response) {
            if (err) {
                //handle dublicate file case.
                console.log(err);
                if (err.name == "MongoError" && err.code == 11000) {
                    res.status(300).json({
                        status: false,
                        msg: 'Sprint already exists. Please try with new sprint name'
                    })
                }
                return;
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

    }
}
module.exports = router