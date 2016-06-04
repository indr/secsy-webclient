import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.findRecord('contact', params.id);
    },
    
    actions: {
        delete() {
            console.log('routes/contacts/view.js/delete()');
            
            const model = this.controller.get('model');
            model.destroyRecord().then(() =>
                this.transitionTo('contacts'));
        }
    }
});
