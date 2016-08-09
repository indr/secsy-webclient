import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('contact', params.id);
  },
  
  afterModel(model) {
    const self = this;
    
    // Nasty hack, I don't know why I can not send actions in model() or afterModel()
    // this.send('selectMarker', model);
    window.setTimeout(function () {
      Ember.run(() => {
        self.send('selectMarker', model);
      });
    }, 500);
  }
});
