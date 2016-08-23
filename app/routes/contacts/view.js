import Ember from 'ember';

export default Ember.Route.extend({
  sharer: Ember.inject.service(),
  store: Ember.inject.service(),
  
  model(params) {
    return this.get('store').findRecord('contact', params.id);
  },
  
  actions: {
    delete() {
      const model = this.controller.get('model');
      
      if (model.get('me')) {
        const flash = this.get('flashMessages');
        flash.dangerT('errors.no-delete-self');
        return;
      }
      
      model.destroyRecord().then(() => {
        this.transitionTo('contacts');
      }, (err) => {
        throw err;
      }).catch((err) => {
        this.get('flashMessages').dangerT(err.message || err, 'save.unknown-error');
      });
    },
    
    share() {
      const model = this.controller.get('model');
      const sharer = this.get('sharer');
      const flashMessages = this.get('flashMessages');
      
      sharer.share(model, this.send.bind(this, 'onProgress')).then(() => {
        Ember.run.later(flashMessages.success.bind(this, 'Successfully shared your info'), 1200);
      }).catch((err) => {
        // TODO: Error handling
        flashMessages.danger('Oops: ' + (err.message || err));
      });
    }
  }
});
