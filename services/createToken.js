const jwt = require('jwt-simple');
const config = require('../config');

module.exports = user => 
	jwt.encode({
    sub: user.id,
    iat: new Date().getTime(),
  }, config.jwtSecret);