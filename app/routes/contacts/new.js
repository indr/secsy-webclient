import Ember from 'ember';

export default Ember.Route.extend({
  intl: Ember.inject.service(),
  store: Ember.inject.service(),
  
  model() {
    return this.get('store').createRecord('contact');
  },
  
  actions: {
    save() {
      this.controller.get('model').save().then(() => {
        this.transitionTo('contacts');
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
  
    willTransition(transition) {
      const model = this.controller.get('model');
      if (!model.get('hasDirtyAttributes')) {
        return;
      }
      
      const message = this.get('intl').t('confirm.pending-unsaved');
      if (window.confirm(message)) {
        model.rollbackAttributes();
      } else {
        transition.abort();
      }
    }
  }
});
