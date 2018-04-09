import Controller from '@ember/controller';
import { inject } from '@ember/service';
import config from '../../config/environment';
import { defaultAvatar } from '../../constants';
import { computed } from '@ember/object';

export default Controller.extend({

	host: config.API.host,

	session: inject(),

	currentUser: inject(),

	avatar: computed('currentUser.customer.avatar', function() {
		const avatar = this.get('currentUser.customer.avatar');

		return avatar || defaultAvatar;
	}),

	actions: {
		invalidateSession() {
			this.get('session').invalidate();

			// Here, we can send a request to invalidate the session on server-side
			// https://stackoverflow.com/questions/36574372/ember-simple-auth-logout-action-with-django-backend
		}
	}

});
