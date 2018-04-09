import Controller from '@ember/controller';
import { inject } from '@ember/service';
import config from '../../config/environment';

export default Controller.extend({

	session: inject(),

	apiBaseUrl: config.apiBaseUrl,

	actions: {
		invalidateSession() {
			this.get('session').invalidate();

			// Here, we can send a request to invalidate the session on server-side
			// https://stackoverflow.com/questions/36574372/ember-simple-auth-logout-action-with-django-backend
		}
	}

});
