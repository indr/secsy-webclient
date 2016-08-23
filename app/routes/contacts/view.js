import Ember from 'ember';

export default Ember.Route.extend({
  store: Ember.inject.service(),
  
  model(params) {
    return this.get('store').findRecord('contact', params.id);
  },
  
  actions: {
    destroy() {
      const model = this.controller.get('model');
      
      if (model.get('me')) {
        const flash = this.get('flashMessages');
        flash.dangerT('errors.no-delete-self');
        return;
      }
      
      model.destroyRecord().then(() => {
        this.transitionTo('contacts');
      }, (err) => {
        this.get('flashMessages').dangerT('save.unknown-error', err.message || err);
      });
    }
  }
});
