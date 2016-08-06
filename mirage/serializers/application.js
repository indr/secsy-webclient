import {RestSerializer} from 'ember-cli-mirage';

export default RestSerializer.extend({

  keyForAttribute(attr) {
    //return underscore(attr);
    return attr;
  }
});
