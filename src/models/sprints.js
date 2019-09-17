// const mongoose = require('mongoose');

// // const storySchema = new mongoose.Schema({

// //     user_story_id: {
// //         type: String,
// //         unique: true,
// //     },

// //     task: []
// // });

// // //var StorySchema = mongoose.model('Story', storySchema);

// // const sprintSchema = new mongoose.Schema({
// //     sprintId: {
// //         type: String,
// //         unique: true
// //     },
// //     noOfDays: Number,
// //     stories: [storySchema]
// // })

// // //var SprintSchema = mongoose.model('Sprint', sprintSchema);


// const sprintsSchema = new mongoose.Schema({
//     sprints: {
//         type: [],
//         ref:'Sprint'
//     }
// })


// //var Sprints = mongoose.model('SprintCollection', sprintsSchema);
// module.exports = mongoose.model('SprintCollection', sprintsSchema);

// // module.exports = {
// //     // story: StorySchema,
// //     // sprint: SprintSchema,
// //     // sprints: Sprints

// //     StorySchema,
// //     SprintSchema,
// //     Sprints
// // };