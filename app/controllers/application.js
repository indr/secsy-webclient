import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  
  isModal: false,
  progress: {value: 0, max: 0, type: 'info'}
});
