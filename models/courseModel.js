const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  video: String,
  created_at: {
    type: Date,
    default: Date.now()
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  position: {
    type: Number
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }
});

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  image: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }]
});

module.exports = {
  Course: mongoose.model("Course", courseSchema),
  Lesson: mongoose.model("Lesson", lessonSchema)
};