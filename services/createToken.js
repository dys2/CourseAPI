const jsonwebtoken = require('jsonwebtoken');
const config = require('../config');

module.exports = user => 
  jsonwebtoken.sign(
    { id: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: '1y' }
);