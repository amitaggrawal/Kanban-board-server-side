const express = require('express');
const router = express.Router();
const Sprint = require('../src/models/sprint');
const ProductBacklog = require('../src/models/productbacklog');

router.post('/api/getSprintById', function (req, res) {

    const sprintId = req.body.sprintId;
    console.log(sprintId);

    Sprint.findById(sprintId, function (err, data) {

        if (err) {
            console.log(err);
            res.status(300).json({
                status: false,
                msg: 'Something went wrong. Please try again later'
            });
        } else {
            console.log(data);
            res.status(200).json({
                status: true,
                sprint: data
            });
        }
    });


});


router.post('/api/getProductBacklogById', function (req, res) {

    const pbId = req.body.productBacklogId;
    console.log(pbId);

    ProductBacklog.findById(pbId, function (err, data) {
        if (err) {
            console.log(err);
            res.status(300).json({
                status: false,
                msg: 'Something went wrong. Please try again later.'
            })
        }else{
            console.log(data);
            res.status(200).json({
                status: true,
                productbacklog: data
            })
        }
    });
});

module.exports = router;