const Course = require("../models/courseModel");

module.exports = {
  createCourse: async (req, res) => {
    try {
      const course = {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        creator: req.user._id
      }
      const newCourse = new Course(course);
      await newCourse.save();
      
      res.send({success: true});
    } catch(err) {
      res.status(422).json(err);
    }
  },
  createLesson: async (req, res) => {
    try {
      const lesson = {
        title: req.body.title,
        description: req.body.description || null,
        creator: req.user._id,
        video: req.body.video || null
        course: req.body.courseId,
        position: req.body.position
      }

      const newCourse = await Course.findByIdAndUpdate(courseId, { "$push": { "lessons": lesson } }, { new: true });
      res.send({newCourse});
    } catch(err) {
      res.status(422).json(err);
    }
  },
  reorderLessons: 

}