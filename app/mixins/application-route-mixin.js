import Ember from 'ember';

export default Ember.Mixin.create({
  keyring: Ember.inject.service(),
  
  init() {
    this._super(...arguments);
    this._subscribeToKeyringEvents();
  },
  
  keyringOpened() {
    // noop
  },
  
  _subscribeToKeyringEvents() {
    this.get('keyring').on('keyringOpened',
      Ember.run.bind(this, () => {
        this['keyringOpened'](...arguments);
      })
    );
  }
});
