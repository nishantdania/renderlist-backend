const User = require('../models/user'),
	config = require('./main'),
	configAuth = require('./auth'),
	JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt,
	LocalStrategy = require('passport-local'),
	FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {
	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	const localOptions = { usernameField: 'email', session : false };  

	const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
		User.findOne({ email: email }, function(err, user) {
			if(err) { return done(err);  }
			if(!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.'  });  }
			user.comparePassword(password, function(err, isMatch) {
				if (err) { return done(err);  }
				if (!isMatch) { return done(null, false, { error: "Your login details could not be verified. Please try again."  });  }
				return done(null, user);
			});
		});
	});

	const jwtOptions = {
		jwtFromRequest: ExtractJwt.fromAuthHeader(),
		secretOrKey: config.secret
	};

	const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
		User.findById(payload._id, function(err, user) {
			if (err) { return done(err, false);  }
			if (user) {
			done(null, user);

			} else {
			done(null, false);

			}
		});
	});

	passport.use(new FacebookStrategy({
        clientID        : configAuth.facebook.clientID,
        clientSecret    : configAuth.facebook.clientSecret,
        callbackURL     : configAuth.facebook.callbackURL,
		profileFields	: ['id', 'displayName', 'photos', 'email', 'location']
	},

// facebook will send back the token and profile
	function(token, refreshToken, profile, done) {

        // asynchronous
	process.nextTick(function() {

            // find the user in the database based on their facebook id
		User.findOne({ 'facebook.id' : profile.id  }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
					if (user) {
                    return done(null, user); // user found, return that user
                
					} else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
					newUser.email = 'dummy';
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned


console.log('profile',profile);
						return done(null, newUser);
					}
			});
		});
}));
	

	passport.use(jwtLogin);
	passport.use(localLogin);

}

