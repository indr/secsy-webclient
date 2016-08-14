import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  
  model() {
    return this.store.createRecord('contact');
  },
  
  actions: {
    save() {
      this.controller.get('model').save().then((model) =>
        this.transitionTo('contacts.view', model));
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
