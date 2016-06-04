import Ember from 'ember';

export default Ember.Route.extend({
    model() {
      return this.store.createRecord('contact');  
    },
    
    templateName: 'contacts/edit',
    
    actions: {
        save() {
            console.log('routes/contacts/new.js/save()');
            
            const model = this.controller.get('model');
            model.save().then(() => 
                this.transitionTo('contacts'));
        },
        
        cancel() {
            console.log('routes/contacts/new.js/cancel()');
            
            const model = this.controller.get('model');
            model.rollbackAttributes();
            this.transitionTo('contacts');
        },
        
        willTransition() {
            console.log('routes/contacts/new.js/willTransition()');
            
            const model = this.controller.get('model');
            model.rollbackAttributes();
        }
    }
});
