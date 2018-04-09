import Service, { inject } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { resolve } from 'rsvp';

/**
 * https://github.com/simplabs/ember-simple-auth/blob/master/guides/managing-current-user.md#loading-the-user-with-its-id
 */
export default Service.extend({

	session: inject('session'),

	store: inject(),

	load() {
		// The response of /login service contains the 'user_id' key
		let userId = this.get('session.data.authenticated.userId'); // 'userId' comes from backend

		if (!isEmpty(userId)) {
			return this.get('store').findRecord('customer', userId).then((customer) => {
				this.set('customer', customer);
			});
		}

		return resolve();
	}

});
