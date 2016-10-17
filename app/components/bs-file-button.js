/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';

// https://www.abeautifulsite.net/whipping-file-inputs-into-shape-with-bootstrap-3
export default Ember.Component.extend({
  
  didInsertElement() {
    this.$('input').on('change', this.inputChange.bind(this));
  },
  
  inputChange (event) {
    this.sendAction('action', event.target.files);
  }
});
