/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import BsInput from 'ember-bootstrap/components/bs-input';
import Ember from 'ember';

BsInput.reopen({
  didInsertElement() {
    this._super(...arguments);
    
    if (this.get('autofocus')) {
      const input = this.$();
      if (input) {
        Ember.run.later(function () {
          input.focus();
        }, 100);
      }
    }
  }
});
