import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        save() {
            const self = this;
            this.store
                .createRecord('contact', {
                    name: this.get('name'),
                    emailAddress: this.get('emailAddress'),
                    phoneNumber: this.get('phoneNumber')
                })
                .save().then(record => self.transitionToRoute('contacts.view', record));
            
            return false;
        }
    }
});
