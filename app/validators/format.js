import Format from 'ember-cp-validations/validators/format';

export default Format;

Format.reopen({
  init() {
    // https://github.com/offirgolan/ember-cp-validations/pull/249
    this.regularExpressions['email'] = /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    
    this._super(...arguments);
  }
});
