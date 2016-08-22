import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.createRecord('contact');
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
