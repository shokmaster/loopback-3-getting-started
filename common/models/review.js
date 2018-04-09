'use strict';

// This function is called before a new instance of the Review model is created. The code:
//  - Inserts the publisherId using the access token attached to the request.
//  - Sets the date of the review instance to the current date.
module.exports = function(Review) {
	Review.beforeRemote('create', function(context, user, next) {
		context.args.data.date = Date.now();
		context.args.data.publisherId = context.req.accessToken.userId;
		next();
	});
};
