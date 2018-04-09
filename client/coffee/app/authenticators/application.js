import config from '../config/environment';
import Loopback from 'ember-simple-auth-loopback/authenticators/loopback';

export default Loopback.extend({

	loginEndpoint: config.API.loginEndpoint,

});
