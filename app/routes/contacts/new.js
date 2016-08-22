import Ember from 'ember';

export default Ember.Route.extend({
  store: Ember.inject.service(),
  
  model() {
    return this.get('store').createRecord('contact');
  },
  
  actions: {
    save() {
      this.controller.get('model').save().then(() => {
        this.transitionTo('contacts')
      }, (err) => {
        throw err;
      }).catch((err) => {
        this.get('flashMessages').dangerT(err.message || err, 'save.unknown-error');
      });
    },
    
    cancel() {
      this.controller.get('model').rollbackAttributes();
      this.transitionTo('contacts');
    },
    
    willTransition() {
      this.controller.get('model').rollbackAttributes();
    }
  }
});
