import Ember from 'ember';
import ENV from 'addressbook/config/environment';

export default Ember.Route.extend({
  sharer: Ember.inject.service(),
  
  model(params) {
    return this.store.findRecord('contact', params.id);
  },

  afterModel(/*model, transition*/) {
    //model.set('accessedAt', new Date());
    //model.save();
  },

  actions: {
    delete() {
      const model = this.controller.get('model');
      
      if (ENV.APP.autoCreateMe && model.get('me')) {
        const flash = this.get('flashMessages');
        flash.dangerT(undefined, 'no-delete-self');
        return;
      }
      
      model.destroyRecord().then(() =>
        this.transitionTo('contacts'));
    },
    
    share() {
      const model = this.controller.get('model');
      const sharer = this.get('sharer');
      const flashMessages = this.get('flashMessages');
      
      sharer.share(model).then(() => {
        flashMessages.success('Successfully shared your info');
      }).catch((err) => {
        flashMessages.danger('Oops: ' + (err.message || err));
      });
    }
  }
});
