import Ember from 'ember';
import TrackerMixin from './../../mixins/tracker-mixin';

export default Ember.Route.extend(TrackerMixin, {
  store: Ember.inject.service(),
  
  model(params) {
    return this.get('store').findRecord('contact', params.id);
  },
  
  actions: {
    apply(keys) {
      const contact = this.controller.get('model');
      
      contact.applyUpdates(keys);
      
      this.track('controller.applyState', contact.save()).then(() => {
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
      
      this.track('controller.dismissState', contact.dismissUpdates()).then(() => {
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
