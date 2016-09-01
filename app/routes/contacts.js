import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import DecryptedRouteMixin from '../mixins/decrypted-route-mixin';
import Ember from 'ember';

export default Ember.Route.extend(AuthenticatedRouteMixin, DecryptedRouteMixin, {
  firstTransition: true,
  
  model() {
    return this.get('store').findAll('contact').then((result) => {
      console.log('routes/contacts#model() loaded %s records', result.get('length'));
      return result;
    });
  },
  
  actions: {
    didTransition() {
      if (this.firstTransition) {
        this.firstTransition = false;
        Ember.run.later(this.send.bind(this, 'pullUpdates', {silent: true}), 1000 * 2);
      }
      
      const showCreateOrGenerateHint = this.controller.get('model')
          .get('length') <= 1;
      this.controller.set('showCreateOrGenerateHint', showCreateOrGenerateHint);
    }
  }
});
