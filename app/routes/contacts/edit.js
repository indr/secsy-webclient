import Ember from 'ember';

export default Ember.Route.extend({
  intl: Ember.inject.service(),
  store: Ember.inject.service(),
  
  model(params) {
    return this.get('store').findRecord('contact', params.id);
  },
  
  actions: {
    save() {
      const model = this.controller.get('model');
      model.save().then(() => {
        this.transitionTo('contacts.view', model);
      }, (err) => {
        throw err;
      }).catch((err) => {
        this.get('flashMessages').dangerT('save.unknown', err.message || err);
      });
    },
    
    cancel() {
      const model = this.controller.get('model');
      model.rollbackAttributes();
      this.transitionTo('contacts.view', model);
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
