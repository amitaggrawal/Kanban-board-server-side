const express = require('express');
const multer = require('multer');
const router = express.Router();

const ArtifactModel = require('../src/models/artifact.model');
const Project = require('../src/models/project');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        var ext = file.originalname.split('.');
        // cb(null, file.originalname + '-' + Date.now() + "." + ext[1])
        cb(null, file.originalname + '-' + Date.now())
    }
});

const upload = multer({
    storage: storage
}).array('file', 5);

artifactUploaded = [];

/**
 * @amitaggrawal on 4th Sept 19: 
 * This uploads and stores artifacts sent by client.  
 */
router.post('/', function (req, res) {

    upload(req, res, function (err) {
        if (err) {
            res.status(300).json({
                status: false,
                msg: 'Only 5 files are allowed at a time.'
            })
        } else {
            let request = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    let uploadedArtifact = new ArtifactModel();
                    uploadedArtifact.projectID = req.body.projectID,
                        uploadedArtifact.artifactStoreFileName = file.filename,
                        uploadedArtifact.artifactFileOriginalName = file.originalname

                    addToDB(uploadedArtifact, res, resolve, reject);
                })
            });

            Promise.all(request).then(() => {
                console.log('sent')
                res.status(200).json({
                    status: true,
                    files: artifactUploaded
                });
                artifactUploaded = [];
            });
        }
    });

});

function addToDB(uploadedArtifact, res, resolve, reject) {
    uploadedArtifact.save(function (err, data) {
        if (err) {
            reject();
            res.status(300).json({
                status: false,
                msg: err.message
            })

        } else {
            response = {
                artifactId: data._id,
                fileName: data.artifactFileOriginalName
            };

            addToProject(response, uploadedArtifact.projectID, resolve);

        }

    });
}


function addToProject(response, projectID, resolve) {
    Project.findByIdAndUpdate(projectID, { "$push": { "artifacts": response } }, { 'upsert': true }, function (err, data) {

        if (err) {
            console.log(err);
        } else {
            artifactUploaded.push(response);
            resolve();
        }
    });

}
module.exports = router;