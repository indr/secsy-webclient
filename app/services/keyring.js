import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  session: Ember.inject.service(),
  isOpen: false,
  attemptedTransition: null,
  
  init() {
    this._super(...arguments);
    this._subscribeToSessionEvents();
  },
  
  open() {
    Ember.Logger.info('Opening keyring');
    this.set('isOpen', true);
    this.trigger('keyringOpened', ...arguments);
  },
  
  close() {
    Ember.Logger.info('Closing keyring');
    this.set('isOpen', false);
    this.trigger('keyringClosed', ...arguments);
  },
  
  _subscribeToSessionEvents() {
    this.get('session').on('invalidationSucceeded',
      Ember.run.bind(this, () => {
        this['close'](...arguments);
      })
    );
  }
});
