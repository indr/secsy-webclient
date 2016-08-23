import Ember from 'ember';

export default Ember.Route.extend({
  store: Ember.inject.service(),
  
  model(params) {
    return this.get('store').findRecord('contact', params.id);
  },
  
  actions: {
    update(properties) {
      console.log(properties);
      console.log('TODO: routes/contacts/review/actions#update');
    },
    
    dismiss() {
      console.log('TODO: routes/contacts/review/actions#dismiss');
    },
    
    back() {
      const model = this.controller.get('model');
      this.transitionTo('contacts.view', model);
    }
  }
});
