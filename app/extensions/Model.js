/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';
import Model from 'ember-data/model';

export default Model.reopen({
  inFlight: Ember.computed('currentState.stateName', function () {
    return this.get('currentState.stateName').indexOf('inFlight') > -1;
  })
});
