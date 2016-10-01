/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Model from 'ember-data/model';
import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  emailSha256: attr('string', {
    readonly: true
  }),
  
  isPublic: attr('boolean', {
    readonly: true
  }),
  
  privateKey: attr('string'),
  
  publicKey: attr('string'),
});
