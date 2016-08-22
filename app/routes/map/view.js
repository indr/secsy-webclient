import Ember from 'ember';

export default Ember.Route.extend({
  store: Ember.inject.service(),
  
  beforeModel(transition) {
    this.center = transition.queryParams.center;
  },
  
  model(params) {
    this.center = true;
    return this.get('store').findRecord('contact', params.id);
  },
  
  actions: {
    didTransition() {
      if (this.center) {
        this.send('setCenter', this.controller.model.get('location'), 3);
      }
      this.send('openPopup', this.controller.model);
    }
  }
});
