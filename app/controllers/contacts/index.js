import Ember from 'ember';
import computedFilterByQuery from 'ember-cli-filter-by-query';

export default Ember.Controller.extend({
    // http://discuss.emberjs.com/t/filter-data-client-side/9681/2
    // https://github.com/lazybensch/ember-cli-filter-by-query
    filtered: computedFilterByQuery('model', ['name', 'emailAddress', 'phoneNumber'], 'query')
});
