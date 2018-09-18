const graphqlHTTP = require('express-graphql');


const userController = require('../controllers/userController');
const requireLogin = require('../services/auth').requireLogin;
const requireAuth = require('../services/auth').requireAuth;
const checkAuth = require('../services/auth').checkAuth;
const schema = require('../schema');
const auth = require('../services/authMiddleware');



module.exports = server => {
  server.route('/graphiql')
    .get(auth, graphqlHTTP(req => ({
			schema,
			context: {
        user: req.user
      },
      graphiql: true
    })))
    .post(auth, graphqlHTTP(req => ({
			schema,
			context: {
        user: req.user
      }
		})));
	server.route('/graphql')
    .get(checkAuth, graphqlHTTP({
      schema,
    }))
    .post(checkAuth, graphqlHTTP({
      schema,
    }));
	server.route('/create_user')
		.post(userController.createUser);
	server.route('/login')
		.post(requireLogin, userController.login);
	server.route('/verify_user')
    .put(requireAuth, userController.verify);
  server.route('/check_auth')
    .get(requireAuth, userController. checkAuth);
}