const AuthenticationController = require('./controllers/authentication'),  
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

apiRoutes.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email'  }));

    // handle the callback after facebook has authenticated the user
    apiRoutes.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/failure'
        
				}));



	app.use('/api', apiRoutes);
};
