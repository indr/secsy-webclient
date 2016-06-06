import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.createRecord('contact');  
  },

  actions: {
    save() {
      const model = this.controller.get('model');
      model.save().then(() => 
        this.transitionTo('contacts.view', model));
    },

    cancel() {
      const model = this.controller.get('model');
      model.rollbackAttributes();
      this.transitionTo('contacts');
    },

    willTransition() {
      const model = this.controller.get('model');
      model.rollbackAttributes();
    }
  }
});
