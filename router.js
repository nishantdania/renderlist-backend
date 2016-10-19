const AuthenticationController = require('./controllers/authentication'),  
	StudioController = require('./controllers/studio'),  
	express = require('express');

module.exports = function(app, passport) {  
	const requireAuth = passport.authenticate('jwt', { session: false  });  
	const requireLogin = passport.authenticate('local', { session: false  }); 
	const apiRoutes = express.Router(),
	authRoutes = express.Router();
	apiRoutes.use('/auth', authRoutes);
	authRoutes.post('/register', AuthenticationController.register);
	authRoutes.post('/login', requireLogin, AuthenticationController.login);
	apiRoutes.get('/', requireAuth, 
		function(req, res){
			res.status(201).send('You are logged in...'); 
		}		
	);

	authRoutes.get('/facebook', passport.authenticate('facebook'));
    authRoutes.get('/facebook/callback', passport.authenticate('facebook'), AuthenticationController.fbLogin);
	
	authRoutes.get('/google', passport.authenticate('google',{ scope : ['profile', 'email']  }));
    authRoutes.get('/google/callback', passport.authenticate('google'), AuthenticationController.fbLogin);

	apiRoutes.post('/addStudio', StudioController.addStudio);
	apiRoutes.get('/studios', StudioController.getStudios);

	app.use('/api', apiRoutes);
};
