module.exports = new function () {
	switch (process.env.NODE_ENV) {
	case 'production' :
		return {
			'loginTokenExpiration': 2592000, // 1 month
			'secret': 'carpediemdafaq',
			'database': 'mongodb://localhost:27017/renderlist',
			'port': process.env.PORT || 3000
		};

	default :
		return {
			'loginTokenExpiration': 2592000, // 1 month
			'secret': 'carpediemdafaq',
			'database': 'mongodb://nishantdania:conjur3r@ds017672.mlab.com:17672/users',
			'port': process.env.PORT || 3000
		};
	}
}
