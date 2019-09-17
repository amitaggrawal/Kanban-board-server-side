const express = require('express');
const router = express.Router();

const Project = require('../src/models/project');

router.post('/', function(req, res) {
   const projectID = req.body.projectID;
   
   Project.findById(projectID, function(err, data){
       if(err){
           console.log(err);
           res.status(300).json({
               status: false,
               msg: 'Something went wrong!'
           })
       }else{
           console.log(data);
           res.status(200).json({
               status: true,
               artifacts: data.artifacts
           })
       }
   });
   
});

module.exports = router;
