import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel(transition) {
    this.center = transition.queryParams.center;
  },
  
  model(params) {
    this.center = true;
    return this.store.findRecord('contact', params.id);
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
