import Ember from 'ember';
import AdapterMixin from '../../../mixins/adapter';
import { module, test } from 'qunit';

module('Unit | Mixin | adapter');

// Replace this with your real tests.
test('it works', function(assert) {
  var AdapterObject = Ember.Object.extend(AdapterMixin);
  var subject = AdapterObject.create();
  assert.ok(subject);
});
