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
    
    deleteLocation() {
      const model = this.controller.get('model');
      model.set('latitude$', null);
      model.set('longitude$', null);
      model.save();
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
    },
    
    applyShare(share) {
      const contact = this.controller.get('model');
      const decrypted = share.decrypted;
      contact.set('phoneNumber$', decrypted.phoneNumber$);
      contact.set('latitude$', decrypted.latitude$);
      contact.set('longitude$', decrypted.longitude$);
      contact.save().then(() => {
        share.share.destroyRecord().then(() => {
          contact.set('sharesCount', contact.get('sharesCount') - 1);
          const shares = contact.get('shares');
          for (var i = 0; i < shares.length; i++) {
            // console.log(shares[i].share.id, share.share.id);
            if (shares[i].share.id === share.share.id) {
              shares.splice(i, 1);
              break;
            }
          }
          // console.log(shares);
          contact.set('shares', null);
          contact.set('shares', Array.from(shares));
        });
      });
    },
    
    dismissShare(share) {
      const contact = this.controller.get('model');
      share.share.destroyRecord().then(() => {
        contact.set('sharesCount', contact.get('sharesCount') - 1);
        const shares = contact.get('shares');
        for (var i = 0; i < shares.length; i++) {
          // console.log(shares[i].share.id, share.share.id);
          if (shares[i].share.id === share.share.id) {
            shares.splice(i, 1);
            break;
          }
        }
        // console.log(shares);
        contact.set('shares', null);
        contact.set('shares', Array.from(shares));
      });
    }
  }
});
