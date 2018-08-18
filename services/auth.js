const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const User = require('../models/userModel');
const config = require('../config');


const opts = {
	secretOrKey: config.jwtSecret,
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	session: false
};


const tokenCheck = new JwtStrategy(opts, function(jwt_payload, done) {
	User.findOne({id: jwt_payload.sub}, function(err, user) {
			if (err) {
					return done(err, false);
			}
			if (user) {
					return done(null, user);
			} else {
					return done(null, false);
					// or you could create a new account
			}
	});
});

const logIn = new LocalStrategy(
	{
		usernameField: 'email'
	},
  function(email, password, done) {
    User.findOne({ email }, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false);
      if (!user.verifyPassword(password)) return done(null, false);
      return done(null, user);
    });
  }
);

passport.use(tokenCheck);
passport.use(logIn);

module.exports = {
  requireAuth: passport.authenticate('jwt', { session: false }),
  requireLogin: passport.authenticate('local',{ session: false })
};