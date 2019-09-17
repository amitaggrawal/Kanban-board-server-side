var express = require('express');
var router = express.Router();
const Projects = require('../src/models/project');

router.post('/api/project', function (req, res, next) {
    const id = req.body.projectId;
    console.log(id);
    Projects.findById(id, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            res.status(200).json({
                status: true,
                sprint: data
            })
        }
    });
});


module.exports = router;