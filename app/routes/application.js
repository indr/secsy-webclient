import Ember from 'ember';
import SimpleAuthApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import CustomApplicationRouteMixin from '../mixins/application-route-mixin';

export default Ember.Route.extend(SimpleAuthApplicationRouteMixin, CustomApplicationRouteMixin, {
  intl: Ember.inject.service(),
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  crypto: Ember.inject.service(),
  
  beforeModel()  {
    this.restoreLocale();
  },
  
  restoreLocale() {
    const localeName = this.get('session').get('data.localeName') || 'en-us';
    this.get('intl').setLocale(localeName);
  },
  
  actions: {
    setLocale(localeName) {
      this.get('intl').setLocale(localeName);
      this.get('session').set('data.localeName', localeName);
    },
    
    invalidateSession() {
      this.get('session').invalidate();
    },
    
    getShares() {
      console.log('get shares');
      const emailAddress = this.get('session.data.authenticated.email');
      this.get('store').query('share', {for: emailAddress.toLowerCase()}).then((shares) => {
        if (!shares) {
          console.log('no shares');
          return;
        }
        var array = shares.toArray();
        console.log('number of shares', array.length);
        const crypto = this.get('crypto');
        const userId = this.get('session.data.authenticated.id');
        this.get('store').query('contact', {userId}).then((contacts) => {
          array.forEach((each) => {
            
            const {algorithm, encrypted} = each.getProperties('algorithm', 'encrypted');
            crypto.decrypt({algorithm, data: encrypted}).then((decrypted) => {
              console.log('decrypted', decrypted);
              
              const contact = contacts.findBy('emailAddress$', decrypted.emailAddress$);
              
              var shares = contact.get('shares');
              // console.log('shares', shares);
              if (!shares) {
                shares = [];
                // console.log('contact.set(\'shares\')');
                contact.set('shares', shares);
              }
              // console.log('shares.push()');
              var found = false;
              for (var i = 0; i < shares.length; i++) {
                if (shares[i].share.id === each.id) {
                  found = true;
                }
              }
              if (!found) {
                shares.push({share: each, decrypted});
                contact.set('shares', null);
                contact.set('shares', shares);
                var count = contact.get('sharesCount') || 0;
                contact.set('sharesCount', count + 1);
              }
              // contact.set('phoneNumber$', decrypted.phoneNumber$);
              // contact.set('latitude$', decrypted.latitude$);
              // contact.set('longitude$', decrypted.longitude$);
              // contact.save().then(() => {
              //   each.destroyRecord();
              // });
            });
          });
        });
        
      });
    }
  }
});
