import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  
  isOpen: false,
  
  attemptedTransition: null,
  
  open() {
    this.set('isOpen', true);
    this.trigger('keyringOpened', ...arguments);
  }
});
