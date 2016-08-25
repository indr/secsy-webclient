import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  
  noSsl: window.location.href.indexOf('https') !== 0 && window.location.href.indexOf('http://localhost') !== 0,
  
  isModal: false,
  progress: {value: 0, max: 0, type: 'info'}
});
