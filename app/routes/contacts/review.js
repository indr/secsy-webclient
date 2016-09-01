import Ember from 'ember';

export default Ember.Route.extend({
  store: Ember.inject.service(),
  
  model(params) {
    return this.get('store').findRecord('contact', params.id);
  },
  
  actions: {
    apply(keys) {
      const contact = this.controller.get('model');
      
      contact.applyUpdates(keys);
      
      contact.save().then(() => {
        return contact.dismissUpdates()
      }).then(() => {
        this.get('flashMessages').successT('review.update-successful');
        this.transitionTo('contacts.view', contact);
      }).catch((err) => {
        this.get('flashMessages').dangerT('review.update-unknown-error', err.message || err);
      });
    },
    
    dismiss() {
      const contact = this.controller.get('model');
      
      contact.dismissUpdates().then(() => {
        // this.get('flashMessages').successT('review.dismiss-successful');
        this.transitionTo('contacts.view', contact);
      }).catch((err) => {
        this.get('flashMessages').dangerT('review.dismiss-unknown-error', err.message || err);
      });
    },
    
    back() {
      const model = this.controller.get('model');
      this.transitionTo('contacts.view', model);
    }
  }
});
