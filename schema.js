const graphql = require('graphql');

const {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt
} = graphql;

const createToken = require('./services/createToken');

const Course = require('./models/courseModel').Course;
const Lesson = require('./models/courseModel').Lesson;
const User = require('./models/userModel');
const CourseType = require('./schemas/courseSchema').CourseType;
const LessonType = require('./schemas/courseSchema').LessonType;
const UserType = require('./schemas/userSchema');


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
      async resolve(root, {id}) {
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
    },
    courses: {
      type: GraphQLList(CourseType),
      args: {
        id: {
          type: GraphQLString
        }
      },
      async resolve(root, params) {
        return await Course.find(params);
      }
    },
   findUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        },
      },
      resolve: async (root, {id}, context) => {
        return await User.findById(id);
      }
    },
    me: {
      type: UserType
    },
    checkEmailExists: {
      type: UserType,
      args: {
        email: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: async (root, {email}) => {
        const user = await User.findOne({email});
        if (user)
          return {email};
      }
    },
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
        return lesson;
      }
    },
    signUp: {
      type: UserType,
      args: {
        email: {
          type: new GraphQLNonNull(GraphQLString)
        },
        password: {
          type: new GraphQLNonNull(GraphQLString)
        },
        firstName: {
          type: GraphQLString
        },
        lastName: {
          type: GraphQLString
        },
        picture: {
          type: GraphQLString
        }
      },
      resolve: async (root, params) => {
        try {
          const user = new User(params);
          return await user.save();
        } catch(err) {
          return err;
        }
      }
    },
    logIn: {
      type: GraphQLString,
      args: {
        email: {
          type: new GraphQLNonNull(GraphQLString)
        },
        password: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: async (root, {email, password}, context) => {
        try {
          const user = await User.findOne({ email });
          if (!user) throw "User doesn't exist";
          if (!await user.verifyPassword(password)) throw "Password not correct";
          return createToken(user);
        } catch(err) {
          throw new Error(err);
        }
      }
    },
  }
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: RootMutation });
