/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DecryptedRouteMixin from '../mixins/decrypted-route-mixin';
import Ember from 'ember';

function debug (message) {
  Ember.debug('[route:contacts] ' + message);
}

export default Ember.Route.extend(AuthenticatedRouteMixin, DecryptedRouteMixin, {
  addressbook: Ember.inject.service(),
  
  firstTransition: true,
  
  model() {
    return this.get('addressbook').findContacts({cache: false}).then((results) => {
      debug('Found ' + results.get('length') + ' contacts');
      return results;
    });
  },
  
  actions: {
    didTransition() {
      if (this.firstTransition) {
        this.firstTransition = false;
        Ember.run.later(this.send.bind(this, 'pullUpdates', {silent: true}), 1000 * 2);
      }
      
      const showCreateOrGenerateHint = this.controller.get('model')
          .get('length') <= 1;
      this.controller.set('showCreateOrGenerateHint', showCreateOrGenerateHint);
    }
  }
});
