const userController = require('../controllers/userController');

module.exports = server => {
	server.route('')
		.get((req, res) => res.send(`<h1>Hi</h1>`));
	server.route('/create_user')
		.post(userController.createUser);
}