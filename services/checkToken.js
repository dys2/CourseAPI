const jwt = require('jwt-simple');
const config = require('../config');

module.exports = token => 
	jwt.decode(token, config.jwtSecret);