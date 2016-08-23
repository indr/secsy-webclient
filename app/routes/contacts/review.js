import Ember from 'ember';

const {
  RSVP
} = Ember;

export default Ember.Route.extend({
  store: Ember.inject.service(),
  
  model(params) {
    return this.get('store').findRecord('contact', params.id);
  },
  
  destroyShares(contact, shares) {
    const promises = [];
    for (var j = 0; j < shares.length; j++) {
      var share = shares[j];
      
      promises.push(share.destroyRecord().then((share) => {
        contact.set('sharesCount', contact.get('sharesCount') - 1);
        const shares = contact.get('shares');
        console.log('contact.shares', shares);
        for (var i = 0; i < shares.length; i++) {
          if (shares[i].id === share.id) {
            shares.splice(i, 1);
            console.log('Splicing share');
            contact.set('shares', null);
            contact.set('shares', Array.from(shares));
            return;
          }
        }
      }, (err) => {
        Ember.Logger.debug(err.message || err);
      }));
    }
    return RSVP.allSettled(promises);
  },
  
  actions: {
    update(properties, shares) {
      const contact = this.controller.get('model');
      
      properties.forEach(function (each) {
        contact.set(each.key, each.update);
      });
      
      contact.save().then(() => {
        return this.destroyShares(contact, shares);
      }).then(() => {
        this.get('flashMessages').successT('review.update-successful');
        this.transitionTo('contacts.view', contact);
      }).catch((err) => {
        this.get('flashMessages').dangerT('review.update-unknown-error', err.message || err);
      });
    },
    
    dismiss(shares) {
      const contact = this.controller.get('model');
      
      this.destroyShares(contact, shares).then(() => {
        this.get('flashMessages').successT('review.dismiss-successful');
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
