import BsButton from 'ember-bootstrap/components/bs-button';
import Ember from 'ember';

const {
  computed
} = Ember;

BsButton.reopen({
  iconPending: 'glyphicon glyphicon-cog gly-spin',
  iconResolved: 'glyphicon glyphicon-ok',
  iconRejected: 'glyphicon glyphicon-remove',
  
  icon: computed('active', 'textState', function () {
    let result = this._super();
    
    const textState = this.get('textState');
    if (!textState) {
      return result;
    }
    return this.getWithDefault(`icon${Ember.String.capitalize(textState)}`, result);
  }),
  
  disabled: computed('textState', function () {
    return this._super() || (this.get('textState') === 'pending')
  })
});
