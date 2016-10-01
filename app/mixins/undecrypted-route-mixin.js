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
  keychain: Ember.inject.service(''),
  
  beforeModel(transition) {
    if (this.get('keychain').isOpen) {
      const routeIfAlreadyDecrypted = ENV.APP.routeIfAlreadyDecrypted;
      Ember.assert('The route configured as ENV.APP.routeIfAlreadyDecrypted cannot implement the UndecryptedRouteMixin mixin as that leads to an infinite transitioning loop!',
        this.get('routeName') !== routeIfAlreadyDecrypted);
      
      transition.abort();
      this.transitionTo(routeIfAlreadyDecrypted);
    } else {
      return this._super(...arguments);
    }
  }
});
