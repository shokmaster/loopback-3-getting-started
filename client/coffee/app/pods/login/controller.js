import Controller from '@ember/controller';
import { get } from '@ember/object';
import { inject } from '@ember/service';
import { debug } from '@ember/debug';

export default Controller.extend({

	session: inject(),

	identification: null,

	password: null,

	actions: {

		authenticate() {
			const authenticator = 'authenticator:application';
			const { identification, password } = this.getProperties('identification', 'password');

			this.get('session').authenticate(authenticator, identification, password).then(() => {
				debug('You are logged in. Redirecting to index...');
				this.transitionToRoute('index');
			}).catch((reason) => {
				this.set('errorMessage', (reason.error && reason.error.message) || get(reason, 'errors.0.detail') || reason);
			});
		}

	}

});
