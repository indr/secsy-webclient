import Ember from 'ember';

const {
  debug,
  RSVP
} = Ember;

export default Ember.Route.extend({
  store: Ember.inject.service(),
  
  model(params) {
    return this.get('store').findRecord('contact', params.id);
  },
  
  destroyShares(contact, shares) {
    return RSVP.promiseFor(null, function condition(shares) {
      return shares.length > 0;
    }, function action(shares) {
      const share = shares.pop();
      
      return share.destroyRecord().then(() => {
        contact.set('sharesCount', contact.get('sharesCount') - 1);
        var _shares = contact.get('shares');
        for (var i = 0; i < _shares.length; i++) {
          if (_shares[i].id === share.id) {
            _shares.splice(i, 1);
            contact.set('shares', Array.from(_shares));
            return shares;
          }
        }
        return shares;
      }).catch((err) => {
        debug('Could not destroy share: ', err.message || err);
        return shares;
      });
      
    }, shares);
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
