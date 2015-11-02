import Ember from 'ember';
import StoreMixin from '../../../mixins/store';
import { module, test } from 'qunit';

module('Unit | Mixin | store');

// Replace this with your real tests.
test('it works', function(assert) {
  var StoreObject = Ember.Object.extend(StoreMixin);
  var subject = StoreObject.create();
  assert.ok(subject);
});
