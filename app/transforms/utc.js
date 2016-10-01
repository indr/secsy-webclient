/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

// import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';

function debug () {
  // Ember.debug('[transform:utc] ' + arguments[0])
}
export default DS.Transform.extend({
  deserialize(value) {
    var result = moment(value);
    debug('Deserialize ' + value + ' -> ' + result);
    return result;
  },
  
  serialize(value) {
    var result = value ? value.toJSON() : null;
    debug('Serialize ' + value + ' -> ' + result);
    return result;
  }
});
