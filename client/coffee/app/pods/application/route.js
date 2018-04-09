import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

/**
 * https://github.com/simplabs/ember-simple-auth/blob/master/guides/managing-current-user.md#loading-the-current-user
 */
export default Route.extend(ApplicationRouteMixin, {

	currentUser: inject(),

	beforeModel() {
		return this._loadCurrentUser();
	},

	sessionAuthenticated() {
		this._super(...arguments);

		this._loadCurrentUser();
	},

	_loadCurrentUser() {
		return this.get('currentUser').load().catch(() =>
			this.get('session').invalidate()
		);
	}

});
