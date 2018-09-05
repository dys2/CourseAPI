const graphql = require('graphql');

const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt
} = graphql;

const Course = require('./models/courseModel').Course;
const Lesson = require('./models/courseModel').Lesson;

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
        name: {
          type: new GraphQLNonNull(GraphQLString)
        },
        description: {
          type: new GraphQLNonNull(GraphQLString)
        },
        image: {
          type: new GraphQLNonNull(GraphQLString)
        },
      },
      resolve: async (root, params) => {
        const course = new Course(params);
        return await course.save();
      }
    },
    updateCourse: {
      type: CourseType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        },
        name: {
          type: GraphQLString
        },
        description: {
          type: GraphQLString
        },
        image: {
          type: GraphQLString
        },
      },
      resolve: async (root, params) => {
        return await Course.findByIdAndUpdate(params.id, params, { new: true });
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
        },
        course: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: async (root, params) => {
        const lesson = new Lesson(params);
        const savedLesson = await lesson.save();
        await Course.findByIdAndUpdate(params.course, { "$push": { "lessons": savedLesson.id } }, { new: true });
        return savedLesson;
      }
    },
    updateLesson: {
      type: LessonType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        },
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
      resolve: async (root, params) => {
        const lesson = await Lesson.findByIdAndUpdate(params.id, params, { new: true });
        return lesson
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: RootMutation });