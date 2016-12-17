const AuthenticationController = require('./controllers/authentication'),  
	StudioController = require('./controllers/studio'),  
	GooglePlacesController = require('./controllers/googlePlaces'),
	ContactController = require('./controllers/contact'),
	AdminController = require('./controllers/admin'),
	express = require('express');

var addRedirectURL = function(req, res, next) {
	req.session.redirect = req.query.redirect || 'https://www.renderlist.com';
	next();
};


module.exports = function(app, passport) {  
	const requireAuth = passport.authenticate('jwt', { session: false  });  
	const apiRoutes = express.Router(),
	adminRoutes = express.Router(),
	authRoutes = express.Router();

	apiRoutes.use('/auth', authRoutes);
	apiRoutes.use('/admin', adminRoutes);
	apiRoutes.get('/', requireAuth, 
		function(req, res){
			res.status(200).send('You are logged in...'); 
		}		
	);

	authRoutes.get('/facebook', addRedirectURL, passport.authenticate('facebook', { scope : ['email'] }));
    authRoutes.get('/facebook/callback', passport.authenticate('facebook'), AuthenticationController.socialLogin);
	
	authRoutes.get('/google', addRedirectURL, passport.authenticate('google',{ scope : ['profile', 'email']  }));
    authRoutes.get('/google/callback', passport.authenticate('google'), AuthenticationController.socialLogin);

	apiRoutes.post('/addStudio', requireAuth, StudioController.addStudio);
	apiRoutes.get('/studios', StudioController.getStudios);
	apiRoutes.get('/myStudio', requireAuth, StudioController.getMyStudio);
	apiRoutes.post('/userState', AuthenticationController.checkState)
	apiRoutes.post('/contact', ContactController.saveMessage);
	apiRoutes.post('/places', GooglePlacesController.getPlaces);

	adminRoutes.post('/updateShowreelThumbnail', AuthenticationController.checkAdminAccess, AdminController.updateShowreelThumbnail);
	adminRoutes.post('/verifyShowreel', AuthenticationController.checkAdminAccess, AdminController.verifyShowreel);

	app.use('/api', apiRoutes);
};
