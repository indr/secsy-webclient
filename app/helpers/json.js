/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';

// http://stackoverflow.com/questions/10232574/handlebars-js-parse-object-instead-of-object-object

export function json(params/*, hash*/) {
  return JSON.stringify(params);
}

export default Ember.Helper.helper(json);
