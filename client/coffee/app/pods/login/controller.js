import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({

  session: inject(),

  actions: {

    authenticate() {
      const { identification, password } = this.getProperties('identification', 'password');
      const authenticator = 'authenticator:application';

      this.get('session').authenticate(authenticator, identification, password).then(() => {
        debug('You are logged in. Redirecting to index...');
        this.transitionToRoute('index');
      }).catch((reason) => {
        this.set('errorMessage', (reason.error && reason.error.message) || reason);
      });
    }

  }

});
