import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        save(record) {
            const self = this;
            record.save()
                .then(() => self.transitionToRoute('contacts.view', record));
            return false;
        }
    }
});
