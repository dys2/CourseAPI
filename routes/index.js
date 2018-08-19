const userController = require('../controllers/userController');
const requireLogin = require('../services/auth').requireLogin;
const requireAuth = require('../services/auth').requireAuth;

module.exports = server => {
	server.route('')
		.get((req, res) => res.send(`<h1>Hi</h1>`));
	server.route('/create_user')
		.post(userController.createUser);
	server.route('/login')
		.post(requireLogin, userController.login);
	server.route('/verify_user')
    .put(requireAuth, userController.verify);
  server.route('/check_auth')
    .get(requireAuth, userController. checkAuth);
}