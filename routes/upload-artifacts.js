const express = require('express');
const multer = require('multer');
const sprintModal = require('../src/models/sprint');
const excelToJSON = require('convert-excel-to-json');
const Project = require('../src/models/project');
const productBacklogModel = require('../src/models/productbacklog');
var router = express.Router();

// TODO: Remove this method. Alread moved with improvment in respective file.
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

// TODO: Remove this method. Alread moved with improvment in respective file.

// router.post('/api/upload-artifacts', upload.single('file'), (req, res, next) => {
//     const file = req.file;
//     const projectID = req.body.projectID;

//     if (!file) {
//         const error = new Error('Please upload a file')
//         error.httpStatusCode = 400
//         return next(error)
//     }

//     uploadedFileDisplayDetail = {
//         displayName: file.originalname,
//         fileID: file.filename
//     }

//     Project.findByIdAndUpdate(projectID, { "$push": { "artifacts": uploadedFileDisplayDetail } }, { 'upsert': true }, function (err, data) {

//         if (err) {
//             console.log(err);
//         } else {
//             res.status(200).json({
//                 status: true,
//                 msg: 'File uploaded successfully',
//                 fileDetails: uploadedFileDisplayDetail
//             });
//         }
//     });

//     console.log(uploadedFileDisplayDetail);

// });

// TODO: Remove this method. Alread moved with improvment in respective file.
// router.post('/api/download-artifacts', (req, res) => {

//     const fileID = req.body.artifactID;
//     const projectID = req.body.projectID;

//     console.log(fileID, projectID);

//     Project.findById(projectID, function (err, data) {
//         if (err) {
//             console.log(err);
//         } else {
//             // console.log(data);
//             data.artifacts.forEach(element => {
//                 // console.log(element);
//                 if (element.artifactId == fileID) {
//                     console.log('file found');
//                     const path = require('path').dirname('/Users/ilpinnovation/Desktop/KanbanBackend/kanban/');
//                     console.log(path);

//                     res.sendFile(path + '/kanban/uploads/' + `${fileID}`, function (err) {
//                         if (err) {
//                             console.log(err);
//                         }
//                     })
//                 }
//             });
//         }
//     });
// });

var uploadSprint = multer({
    storage: storage,

    fileFilter: function (req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            req.fileValidationError = 'Invalid file format. Please check the file type';
            callback(null, false);
        }
        callback(null, true);
    }
})

router.post('/api/upload-sprint', uploadSprint.single('file'), function (req, res) {
    const type = req.body.type;
    if (type === 'sprint') {
        uploadSprint(req, res);
    } else {
        uploadProductBacklog(req, res);
    }

});

var uploadProductBacklog = function (req, res) {
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
                //'A': 'feature', //not in use or/cz 1st is blank in xls
                'B': 'feature',
                'C': 'story_number',
                'D': 'description',
                'E': 'acceptance_criteria',
                'F': 'initial_size_estimate',
                'G': 'business_priority',
                'H': 'sprint_number',
                'I': 'comments'
            },
            sheets: ['Product Backlog']
        });

        const product_backlog = new productBacklogModel();
        const projectID = req.body.projectID;
        product_backlog.noOfDays = req.body.noOfDays;
        product_backlog.pbName = req.body.name;
        product_backlog.pbDescription = req.body.description;
        product_backlog.createdOn = new Date().getTime();
        product_backlog.projectID = projectID;

        let data = result['Product Backlog'];
        var keys = [];
        var temp = {};


        var featureObject = {
            feature: '',
            story: []
        }
        // This stucture is used to insert details of product backlog in users/ project db table.
        const productBacklogDetails = {
            productBacklogID: Object,
            productBacklogName: product_backlog.pbName
        }

        data.forEach(element => {

            // console.log(data);
            // return;
            keys = Object.keys(element);
            // console.log(keys);
            // return;
            // console.log('starting with new data element');

            if (Object.keys(temp).length > 0) {

                // console.log('temp becomes: \n');
                // console.log(temp);
                // console.log('\n\n\n');

                featureObject.story.push(temp);
                temp = {};

                if (keys.indexOf('feature') > -1) {
                    if (featureObject.story.length > 0) {
                        // console.log('inserting in stack')
                        // console.log('feature object story becomes: \n');
                        // console.log(featureObject);
                        // console.log('\n\n\n');

                        product_backlog.features.push(featureObject);
                        featureObject = {};
                        featureObject.story = [];
                        featureObject.feature = '';
                    }
                }
            }

            keys.forEach(key => {
                // console.log('key is: \n');
                // console.log(key);
                // console.log('\n\n\n');

                if (key == 'feature') {
                    featureObject.feature = element[key];
                } else {
                    temp[key] = element[key];
                }
            });

        });

        if (Object.keys(temp).length > 0) {

            // console.log('temp becomes: \n');
            // console.log(temp);
            // console.log('\n\n\n');

            featureObject.story.push(temp);
            temp = {};

            if (featureObject.story.length > 0) {

                // console.log('feature object story becomes: \n');
                // console.log(featureObject);
                // console.log('\n\n\n');

                console.log('inserting in stack')
                product_backlog.features.push(featureObject);
                featureObject = {};
                featureObject.story = [];
                featureObject.feature = '';
            }
        }


        if (product_backlog.features.length == 0) {
            res.status(300).json({
                status: false,
                msg: 'File content not valid!'
            });
            return;

        }

        /** working fine */
        product_backlog.save(function (err, response) {
            if (err) {
                //handle dublicate file case.
                console.log(err);
                if (err.name == "MongoError" && err.code == 11000) {
                    res.status(300).json({
                        status: false,
                        msg: 'Product Backlog already exists. Please try with new file name'
                    })
                }
                return;
            } else {
                console.log(response);
                productBacklogDetails.productBacklogID = response._id;

                Project.findOneAndUpdate({ "_id": projectID }, { "$push": { "productBacklog": productBacklogDetails } }, { 'upsert': true }, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.status(200).json({
                            status: true,
                            msg: 'File uploaded successfully',
                            //project Id under which this file is uploaded.
                            project_id: data._id,
                            productBacklog_id: response._id

                        })
                    }

                    return;
                })


            }
        })

    }
}

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
                rows: 2 // 2, 3, 4, etc.
            },
            columnToKey: {
                'A': '{{A1}}',
                // 'B': '{{B1}}',
                'C': 'task_id',
                'D': 'volunteer',
                'E': 'task_details',
                'F': 'initial_effort_estimate',
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
