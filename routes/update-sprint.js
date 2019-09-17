const express = require('express');
const router = express.Router();
const Sprint = require('../src/models/sprint');

router.post('/api/updateSprintById', function (req, res) {

    let sprintId = req.body.sprintId;
    let sprintData = req.body.sprintData;
    console.log(sprintId);
    console.log(sprintData);

    Sprint.findOneAndUpdate(
        { "_id": sprintId },
        { $set: { stories: sprintData } },
        function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
            }
        }
    )
});

module.exports = router;