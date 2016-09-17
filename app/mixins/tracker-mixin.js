import Ember from 'ember';

export default Ember.Mixin.create({
  track(stateProperty, promise) {
    this.set(stateProperty, 'pending');
    return promise.then((result) => {
      this.set(stateProperty, 'resolved');
      return result;
    }).catch((error) => {
      this.set(stateProperty, 'rejected');
      throw error;
    }).finally(() => {
      Ember.run.later(this.set.bind(this, stateProperty, 'default'), 1500);
    });
  }
});
