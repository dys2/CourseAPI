const graphql = require('graphql');

const {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt
} = graphql;

const Course = require('./models/courseModel');

const LessonType = new GraphQLObjectType({
  name: "Lesson",
  fields: () => ({
    id: {
      type: GraphQLString,
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
      resolve: async (course, params) => {
        return await Course.populate('lessons')
      }
    }
  })
});


const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    lesson: {
      type: LessonType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      async resolve(root, {id}, s, t) {
        return await Lesson.findById(id);
      }
    },
    course: {
      type: CourseType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      async resolve(root, { id }) {
        return await Course.findById(id);
      }
    }
  }
});

const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createCourse: {
      type: CourseType,
      args: {
        title: {
          type: new GraphQLNonNull(GraphQLString)
        },
        description: {
          type: new GraphQLNonNull(GraphQLString)
        },
        image: {
          type: new GraphQLNonNull(GraphQLString)
        },
        resolve: async (root, params) => {
          const course = new Course(params);
          return await course.save();
        }
      }
    },
    createLesson: {
      type: LessonType,
      args: {
        title: {
          type: GraphQLString
        },
        description: {
          type: GraphQLString
        },
        video: {
          type: GraphQLString
        }
      },
      // async resolve(root, {id}, s, t) {
      //   return Lesson.findById(id);
      // }
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: RootMutation });
// const lessonSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   description: String,
//   video: String,
//   created_at: {
//     type: Date,
//     default: Date.now()
//   },
//   creator: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//   },
//   position: {
//     type: Number,
//     required: true
//   },
//   course: mongoose.Schema.Types.ObjectId
// });