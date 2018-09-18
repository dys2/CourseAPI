const graphql = require('graphql');

const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
	GraphQLString,
  GraphQLSchema,
	GraphQLInt,
} = graphql;

const Course = require('../models/courseModel').Course;



const LessonType = new GraphQLObjectType({
  name: "Lesson",
  fields: () => ({
    id: {
			type: GraphQLID,
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: GraphQLString,
    },
    video: {
      type: GraphQLString,
    },
    created_at: {
      type: GraphQLString,
    },
    course: {
      type: CourseType
    }
  })
});

const CourseType = new GraphQLObjectType({
  name: "Course",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: GraphQLString,
    },
    image: {
      type: GraphQLString
    },
    created_at: {
      type: GraphQLString
    },
    lessons: {
      type: new GraphQLList(LessonType),
      resolve: async (root, params) => {
        const course = await Course.findById(root.id).populate('lessons');
        return course.lessons;
      }
    },
  }),

});

module.exports = {
	CourseType,
	LessonType
};
