import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('contact', params.id);
  },
  
  actions: {
    save() {
      this.controller.get('model').save().then(() =>
        this.transitionTo('contacts'));
    },
    
    cancel() {
      this.controller.get('model').rollbackAttributes();
      this.transitionTo('contacts');
    },
    
    willTransition() {
      this.controller.get('model').rollbackAttributes();
    },
    
    delete() {
      const model = this.controller.get('model');
      
      if (model.get('me')) {
        const flash = this.get('flashMessages');
        flash.dangerT('no-delete-self');
        return;
      }
      
      // TODO: Error handling
      model.destroyRecord().then(() =>
        this.transitionTo('contacts'));
    },
    
    deleteLocation() {
      const model = this.controller.get('model');
      model.set('latitude$', null);
      model.set('longitude$', null);
      // TODO: Error handling
      model.save();
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
    },
    
    applyShare(share) {
      const contact = this.controller.get('model');
      const decrypted = share.decoded;
      contact.set('phoneNumber$', decrypted.phoneNumber$);
      contact.set('latitude$', decrypted.latitude$);
      contact.set('longitude$', decrypted.longitude$);
      // TODO: Error handling
      contact.save().then(() => {
        share.destroyRecord().then(() => {
          contact.set('sharesCount', contact.get('sharesCount') - 1);
          const shares = contact.get('shares');
          for (var i = 0; i < shares.length; i++) {
            // console.log(shares[i].share.id, share.share.id);
            if (shares[i].id === share.id) {
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
      // TODO: Error handling
      share.destroyRecord().then(() => {
        contact.set('sharesCount', contact.get('sharesCount') - 1);
        const shares = contact.get('shares');
        for (var i = 0; i < shares.length; i++) {
          // console.log(shares[i].share.id, share.share.id);
          if (shares[i].id === share.id) {
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
