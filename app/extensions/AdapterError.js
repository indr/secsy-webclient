/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import DS from 'ember-data';

DS.AdapterError.prototype.getMessage = function () {
  return this.errors[0] ? this.errors[0].message || this.errors[0].detail : this.message;
};

export default DS.AdapterError;
