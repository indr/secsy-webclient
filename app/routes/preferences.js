/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DecryptedRouteMix from './../mixins/decrypted-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, DecryptedRouteMix, {
  session: Ember.inject.service(),
  
  model() {
    const user = this.get('session').get('data.authenticated');
    return Ember.Object.create({
      email: user.email,
      locale: user.locale,
      syncEnabled: user.sync_enabled
    });
  }
});
