import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.findRecord('contact', params.id);
    },
    
    setupController: function(controller, model) {
        this._super(controller, model);
    
        controller.set('title', 'Edit contact');
    },
    
    actions: {
        save() {
            console.log('routes/contacts/edit.js/save()');
            
            const model = this.controller.get('model');
            model.save().then(() => 
                this.transitionTo('contacts.view', model));
        },
        
        cancel() {
            console.log('routes/contacts/edit.js/cancel()');
            
            const model = this.controller.get('model');
            model.rollbackAttributes();
            this.transitionTo('contacts.view', model);
        },
        
        willTransition() {
            console.log('routes/contacts/edit.js/willTransition()');
            
            const model = this.controller.get('model');
            model.rollbackAttributes();
        }
    }
});
