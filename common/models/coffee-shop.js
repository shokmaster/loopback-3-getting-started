'use strict';

const { log } = console;

module.exports = function(CoffeeShop) {
	CoffeeShop.status = function(cb) {
		const currentDate = new Date();
		const currentHour = currentDate.getHours();
		const OPEN_HOUR = 6;
		const CLOSE_HOUR = 20;

		log('Current hour is %d', currentHour);

		let response;

		if (currentHour >= OPEN_HOUR && currentHour < CLOSE_HOUR) {
			response = 'We are open for business.';
		} else {
			response = 'Sorry, we are closed. Open daily from 6am to 8pm.';
		}

		cb(null, response);
	};

	CoffeeShop.remoteMethod(
		'status', {
			http: {
				path: '/status',
				verb: 'get'
			},
			returns: {
				arg: 'status',
				type: 'string'
			},
		}
	);

	CoffeeShop.getName = function(shopId, cb) {
		CoffeeShop.findById(shopId, function(err, CoffeeShop) {
			// When comes an unexisting ID, PersistentModel crashes the app. Solution:
			// https://stackoverflow.com/a/38353676
			if (err) {
				log(err);
				return cb(err);
			} else {
				if (CoffeeShop) {
					const response = 'Name of coffee shop is ' + CoffeeShop.name;

					cb(null, response);
					log(response);
				} else {
					const error = new Error();

					error.message = 'Coffee Shop is not found.';
					error.statusCode = 404;
					cb(error);
				}
			}
		});
	};

	CoffeeShop.remoteMethod(
		'getName', {
			http: {
				path: '/getname',
				verb: 'get'
			},
			accepts: {
				arg: 'id',
				type: 'number',
				http: { source: 'query' }
			},
			returns: {
				arg: 'name',
				type: 'string'
			},
		}
	);
};
