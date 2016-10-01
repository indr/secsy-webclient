/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import BsFormElement from 'ember-bootstrap-cp-validations/components/bs-form-element';
import Ember from 'ember';

BsFormElement.reopen({
  init() {
    this._super(...arguments);
    this._validationOnFocusOut = false;
  },
  
  focusOut() {
    if (this._validationOnFocusOut) {
      this._super(...arguments);
    }
  },
  
  input() {
    this._super(...arguments);
    this._validationOnFocusOut = true;
  },
  
  didInsertElement() {
    this._super(...arguments);
    
    if (this.get('autofocus')) {
      var input = this.$('input').first()[0];
      if (input) {
        Ember.run.later(function () {
          input.focus();
        }, 100);
      }
    }
  }
});
