const User = require('../models/user'),
	config = require('./main'),
	configAuth = require('./auth'),
	JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt,
	FacebookStrategy = require('passport-facebook').Strategy,
	GoogleStrategy = require('passport-google-oauth2').Strategy;


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

	const jwtOptions = {
		jwtFromRequest: ExtractJwt.fromAuthHeader(),
		secretOrKey: config.secret
	};

	const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
		User.findOne({'_id' : payload.id }, function(err, user) {
			if (err) { return done(err, false);  }
			if (user) {
			done(null, user);

			} else {
			done(null, false);
			}
		});
	});

	const fbOptions = {
		clientID        : configAuth.facebook.clientID,
        clientSecret    : configAuth.facebook.clientSecret,
        callbackURL     : configAuth.facebook.callbackURL,
		profileFields	: ['id', 'displayName', 'photos', 'email']
	
	};
	
	const fbLogin = new FacebookStrategy(fbOptions, function(token, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
					if(err) res.status(404).send(err);
					if(user) {
						return done(null, user);
					} else {
						var newUser = new User();
						newUser.facebook.id = profile.id;
						newUser.facebook.name = profile.displayName;
						newUser.facebook.email = profile.emails && profile.emails[0].value;
						newUser.facebook.token = profile.token;
						newUser.facebook.profilePhoto = profile.photos && profile.photos[0].value;
						newUser.save(function(err, user) {
							if (err) res.status(404).send(err); 
						});
						return done(null, newUser);	
					}
				});
			});
		}
	);
	
	const googleOptions = {
		clientID        : configAuth.google.clientID,
        clientSecret    : configAuth.google.clientSecret,
        callbackURL     : configAuth.google.callbackURL,
		passReqToCallback	: true
	
	};
	
	const googleLogin = new GoogleStrategy(googleOptions, function(request, accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'google.id' : profile.id }, function(err, user) {
					if(err) res.status(404).send(err);
					if(user) {
						return done(null, user);
					} else {
						var newUser = new User();
						newUser.google.id = profile.id;
						newUser.google.name = profile.displayName;
						newUser.google.email = profile.emails && profile.emails[0].value;
						newUser.google.token = profile.token;
						newUser.google.profilePhoto = profile.photos && profile.photos[0].value;
						newUser.save(function(err, user) {
							if (err) res.status(404).send(err); 
						});
						return done(null, newUser);	
					}
				});
			});
		}
	);
	passport.use(jwtLogin);
//	passport.use(localLogin);
	passport.use(fbLogin);
	passport.use(googleLogin);
}

