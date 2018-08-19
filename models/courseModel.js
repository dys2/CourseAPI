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
    type: Number,
    required: true
  },
  course: mongoose.Schema.Types.ObjectId
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
  lessons: [lessonSchema]
});

module.exports = mongoose.model("Course", courseSchema);