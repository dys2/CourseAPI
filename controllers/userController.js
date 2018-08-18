const User = require('../models/userModel');
const createToken = require('../services/createToken');

module.exports = {
	createUser: async (req, res) => {
    try {
      if (!req.body.email || !req.body.password)
        throw {message: "missing email and/or password"};

      const user = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      };
      const newUser = new User(user);
      const savedUser = await newUser.save();

      res.send({
        user: savedUser,
        token: createToken(user)
      });
    } catch(err) {
      res
        .status(422)
        .json(err);
    }
  },
  login: (req, res) => res.send({
    user: {
      email: req.user.email,
      _id: req.user._id 
    },
    token: createToken(req.user)
  }),
  verify: async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.user._id, {verified: true})
      res.send({success: true});
    } catch(err) {
      res
        .status(422)
        .json(err);
    }
  }
}