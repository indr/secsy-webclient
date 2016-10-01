/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';
import ENV from 'secsy-webclient/config/environment';

/**
 * The `DecryptedRouteMixin` ensures that the `keychain` is open. If the keychain is closed, it will
 * call the keychains `restore` method and returns its promise. If this promise is rejected, this mixin
 * aborts the transition, safes the attempted transition object to the keychains `attemptedTransition` property and
 * transitions to the `ENV.APP.decryptionRoute`.
 *
 * When the keychain is opened in the decryption route, the keychain will trigger its `keychainOpened` event. This
 * event will be handled in the application route mixin where the attempted transition is `retry`ed.
 *
 * See ember-simple-auths authenticated-route-mixins (beforeModel)[https://github.com/simplabs/ember-simple-auth/blob/1.1.0-beta.3/addon/mixins/authenticated-route-mixin.js#L36]
 *
 * @class DecryptedRouteMixin
 * @module secsy-webclient/mixins/decrypted-route-mixin
 * @extends Ember.Mixin
 * @public
 */
export default Ember.Mixin.create({
  keychain: Ember.inject.service(),
  
  beforeModel(transition) {
    const _super = this._super.bind(this, ...arguments);
    const keychain = this.get('keychain');
    
    if (this.get('keychain').isOpen) {
      return _super();
    }
    
    // Thinking about setting `keychain.attemptedTransition` before `keychain.restore()`?
    // Good point. The application route mixin will handle `keychainOpened` and look for an attempted transition.
    // If theres none, it won't do anything,.. but, we resolve this promise, so the original transition will be
    // executed.
    
    const self = this;
    
    return keychain.restore().then(() => {
      return _super();
    }).catch(() => {
      const decryptionRoute = ENV.APP.decryptionRoute;
      Ember.assert('The route configured as ENV.APP.decryptionRoute cannot implement the DecryptedRouteMixin mixin as that leads to an infinite transitioning loop!',
        self.get('routeName') !== decryptionRoute);
      
      transition.abort();
      self.set('keychain.attemptedTransition', transition);
      return self.transitionTo(decryptionRoute);
    });
  }
});
