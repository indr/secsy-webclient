import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        delete(record) {
            console.log('delete contacts/view.js');
            const self = this;
            record.destroyRecord().then(function () {
                self.transitionToRoute('contacts');
            });
            return false;
        }
    }
});
