import Ember from 'ember';
import Model from 'ember-data/model';

export default Model.reopen({
  inFlight: Ember.computed('currentState.stateName', function () {
    return this.get('currentState.stateName').indexOf('inFlight') > -1;
  })
});
