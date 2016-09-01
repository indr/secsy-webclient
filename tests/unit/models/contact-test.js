import { assert } from 'chai';
import { describeModel, it } from 'ember-mocha';
import { beforeEach, describe } from 'mocha';
import uuid from 'ember-simple-uuid';
import simple from 'simple-mock';

describeModel('contact', 'Unit | Model | ContactModel', {
    // Specify the other units that are required for this test.
    needs: [
      'validator:presence'
    ]
  },
  function () {
    function makeUpdate (decoded) {
      return {
        id: uuid(),
        decoded: decoded || {}
      }
    }
    
    it('location', function () {
      let sut = this.subject();
      assert.deepEqual(sut.get('location'), null);
      sut.set('location_latitude$', 45);
      assert.deepEqual(sut.get('location'), null);
      sut.set('location_longitude$', 105);
      assert.deepEqual(sut.get('location'), [45, 105]);
      sut.set('location_latitude$', null);
      assert.deepEqual(sut.get('location'), null);
    });
    
    describe('#pushUpdate', function () {
      let sut;
      
      beforeEach(function () {
        sut = this.subject();
        sut.set('name$', 'User 1');
        sut.set('emailAddress$', 'user1@example.com');
        sut.set('contact_phoneNumber$', '01234');
        sut.set('')
      });
      
      it('should add update to collection', function () {
        let update = makeUpdate();
        sut.pushUpdate(update);
        
        assert.equal(sut.get('updates')[0], update);
        assert.equal(sut.get('updates.length'), 1);
      });
      
      it('should ignore update with same id', function () {
        let update = makeUpdate();
        sut.pushUpdate(update);
        sut.pushUpdate(update);
        
        assert.equal(sut.get('updates')[0], update);
        assert.equal(sut.get('updates.length'), 1);
        assert.lengthOf(Object.keys(sut.get('mergedUpdate')), 0);
      });
      
      it('should set newValuesCount and mergedUpdate according to new values', function () {
        let decoded = {
          contact_phoneNumber$: sut.get('contact_phoneNumber$'),
          internet_skype$: '',
          internet_telegram$: 'new',
          internet_whatsapp$: 'also new'
        };
        sut.pushUpdate({decoded});
        
        assert.equal(sut.get('newValuesCount'), 2);
        assert.lengthOf(Object.keys(sut.get('mergedUpdate')), 2);
      });
      
      it('should not increase newValuesCount given two update with same values', function () {
        const decoded = {
          internet_telegram$: 'new'
        };
        sut.pushUpdate(makeUpdate(decoded));
        sut.pushUpdate(makeUpdate(decoded));
        
        assert.equal(sut.get('updates.length'), 2);
        assert.equal(sut.get('newValuesCount'), 1);
        assert.lengthOf(Object.keys(sut.get('mergedUpdate')), 1);
      });
      
      it('should decrease newValuesCount given second update clears prior updates values', function () {
        sut.pushUpdate(makeUpdate({internet_skype$: 'new'}));
        sut.pushUpdate(makeUpdate({internet_skype$: ''}));
        
        assert.equal(sut.get('updates.length'), 2);
        assert.equal(sut.get('newValuesCount'), 0);
        assert.lengthOf(Object.keys(sut.get('mergedUpdate')), 0);
      });
      
      it('should ignore updates on emailAddress$', function () {
        sut.pushUpdate(makeUpdate({emailAddress$: 'new@example.com'}));
        
        assert.equal(sut.get('updates.length'), 1);
        assert.equal(sut.get('newValuesCount'), 0);
        assert.lengthOf(Object.keys(sut.get('mergedUpdate')), 0);
      });
    });
    
    describe('#dismissUpdates', function () {
      let sut, destroyRecord;
      
      beforeEach(function () {
        sut = this.subject();
        sut.pushUpdate(makeUpdate({internet_skype$: 'new skype'}));
        sut.pushUpdate(makeUpdate({internet_telegram$: 'new telegram'}));
        sut.pushUpdate(makeUpdate());
        destroyRecord = simple.stub();
        sut.get('updates').forEach((each) => {
          each.destroyRecord = destroyRecord;
        });
      });
      
      it('should destroy all records', function () {
        destroyRecord.resolveWith();
        
        return sut.dismissUpdates().then(() => {
          assert(destroyRecord.called);
          assert.equal(destroyRecord.callCount, 3);
          assert.lengthOf(sut.get('updates'), 0);
        });
      });
      
      it('should continue to try to destroy all records given they reject', function () {
        destroyRecord.rejectWith(new Error('destroyRecord() rejected'));
        
        return sut.dismissUpdates().then(() => {
          assert(destroyRecord.called);
          assert.equal(destroyRecord.callCount, 3);
          assert.lengthOf(sut.get('updates'), 0);
        });
      });
      
      it('should reset newValuesCount and mergedUpdate', function () {
        destroyRecord.resolveWith();
        
        assert.isAbove(sut.get('newValuesCount'), 0);
        assert.notDeepEqual(sut.get('mergedUpdate'), {});
        
        return sut.dismissUpdates().then(() => {
          assert.equal(sut.get('newValuesCount'), 0);
          assert.deepEqual(sut.get('mergedUpdate'), {});
        })
      });
    });
    
    describe('#applyUpdates', function () {
      let sut;
      
      beforeEach(function () {
        sut = this.subject();
        sut.pushUpdate(makeUpdate({internet_skype$: 'new skype'}));
        sut.pushUpdate(makeUpdate({contact_website$: 'www.secsy.io', internet_telegram$: 'new telegram'}));
        sut.pushUpdate(makeUpdate());
      });
      
      it('should update selected values', function () {
        sut.applyUpdates(['internet_skype$', 'contact_website$']);
        assert.equal(sut.get('internet_skype$'), 'new skype');
        assert.equal(sut.get('contact_website$'), 'www.secsy.io');
        assert.equal(sut.get('internet_telegram$'), undefined);
      });
      
      it('should not clear updates', function () {
        sut.applyUpdates();
        assert.isAbove(sut.get('updates').length, 0);
      });
    });
  }
);
