const AuthenticationController = require('./controllers/authentication'),  
	StudioController = require('./controllers/studio'),  
	GooglePlacesController = require('./controllers/googlePlaces'),
	ContactController = require('./controllers/contact'),
	express = require('express');

var addRedirectURL = function(req, res, next) {
	req.session.redirect = req.query.redirect || 'http://www.renderlist.com';
	next();
};


module.exports = function(app, passport) {  
	const requireAuth = passport.authenticate('jwt', { session: false  });  
	const apiRoutes = express.Router(),

	authRoutes = express.Router();
	apiRoutes.use('/auth', authRoutes);
	apiRoutes.get('/', requireAuth, 
		function(req, res){
			res.status(200).send('You are logged in...'); 
		}		
	);

	authRoutes.get('/facebook', addRedirectURL, passport.authenticate('facebook'));
    authRoutes.get('/facebook/callback', passport.authenticate('facebook'), AuthenticationController.socialLogin);
	
	authRoutes.get('/google', addRedirectURL, passport.authenticate('google',{ scope : ['profile', 'email']  }));
    authRoutes.get('/google/callback', passport.authenticate('google'), AuthenticationController.socialLogin);

	apiRoutes.post('/addStudio', requireAuth, StudioController.addStudio);
	apiRoutes.get('/studios', StudioController.getStudios);
	apiRoutes.get('/myStudio', requireAuth, StudioController.getMyStudio);
	apiRoutes.post('/userState', AuthenticationController.checkState)
	apiRoutes.post('/contact', ContactController.saveMessage);

	apiRoutes.post('/places', GooglePlacesController.getPlaces);

	app.use('/api', apiRoutes);
};
