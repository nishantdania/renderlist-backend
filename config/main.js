module.exports = new function () {
	switch (process.env.NODE_ENV) {
	case 'production' :
		return {
			'loginTokenExpiration': 2592000, // 1 month
			'secret': 'carpediemdafaq',
			'database': 'mongodb://localhost:27017/renderlist',
			'port': process.env.PORT || 3000,
			'adminKey': 'Q29uanVyM3Iu'
		};

	default :
		return {
			'loginTokenExpiration': 2592000, // 1 month
			'secret': 'carpediemdafaq',
			'database': 'mongodb://nishantdania:conjur3r@ds155418.mlab.com:55418/renderlist',
			'port': process.env.PORT || 3000,
			'adminKey': 'Q29uanVyM3Iu'
		};
	}
}
