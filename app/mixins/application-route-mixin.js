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

export default Ember.Mixin.create({
  keychain: Ember.inject.service(),
  
  init() {
    this._super(...arguments);
    this._subscribeToKeychainEvents();
  },
  
  keychainOpened() {
    const attemptedTransition = this.get('keychain.attemptedTransition');
    
    if (attemptedTransition) {
      this.set('keychain.attemptedTransition', null);
      attemptedTransition.retry();
    } else {
      this.transitionTo(ENV.APP.routeAfterDecryption);
    }
  },
  
  _subscribeToKeychainEvents() {
    this.get('keychain').on('keychainOpened',
      Ember.run.bind(this, () => {
        this['keychainOpened'](...arguments);
      })
    );
  }
});
