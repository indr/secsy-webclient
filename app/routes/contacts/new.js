import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  
  model() {
    return this.store.createRecord('contact');
  },

  actions: {
    save() {
      const userId = this.get('session.data.authenticated.user.id');
      const model = this.controller.get('model');
      model.set('userId', userId);
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
