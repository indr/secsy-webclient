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
