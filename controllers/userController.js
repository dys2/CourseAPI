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
        user: {
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          id: savedUser._id
        },
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
  },
  checkAuth: (req, res) => res.send({ 
    user: {
      email: req.user.email,
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName
    }
  }),
  setContentCreator: async (req, res) => {
    try {
      const id = req.params.id;
      if (!req.user.admin)
        throw Error("Not logged in as admin");

      const User = await User.findByIdAndUpdate(id, {contentCreator: true});
      res.send({success: true});
    } catch(err) {
      res
        .status(422)
        .json(err);
    }
  }
}