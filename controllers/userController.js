const User = require('../models/userModel');

module.exports = {
	createUser: async (req, res) => {
    try {
      if (!req.body.email || !req.body.password)
        throw {message: "missing email and/or password"};

      const user = req.body;
      const newUser = new User(user);

      newUser.save()
        .then(console.log)
        .catch(console.log)
      res.send({
        user: savedUser,
        token: ''
      });
    } catch(err) {
      console.log('sdfasdf');
      res
        .status(422)
        .json(err);
    }
	}
}