/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';

export default Ember.Service.extend({
  init() {
    this.adapter = Ember.getOwner(this).lookup('adapter:application');
  },
  
  delete(url, data) {
    return this.ajax(url, 'DELETE', data);
  },
  
  patch(url, data) {
    return this.ajax(url, 'PATCH', data);
  },
  
  post(url, data) {
    return this.ajax(url, 'POST', data);
  },
  
  ajax(url, type, data){
    return this.get('adapter').ajax(url, type, {data: data});
  }
});
