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

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    contentCreator: {
      type: GraphQLBoolean
    },
    admin: {
      type: GraphQLBoolean
    },
    date: {
      type: GraphQLString
    },
    picture: {
      type: GraphQLString
    },
    verified: {
      type: GraphQLBoolean
    }
  })
});

module.exports = UserType;