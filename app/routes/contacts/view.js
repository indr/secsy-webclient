import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('contact', params.id);
  },

  afterModel(model/*, transition*/) {
    model.set('accessedAt', new Date());
    model.save();
  },

  actions: {
    delete() {
      const model = this.controller.get('model');
      model.destroyRecord().then(() =>
        this.transitionTo('contacts'));
    }
  }
});
