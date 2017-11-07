import EmberObject from '@ember/object';
import StoreMixin from 'ember-filter/mixins/store';
import { module, test } from 'qunit';

module('Unit | Mixin | store');

// Replace this with your real tests.
test('it works', function(assert) {
  let StoreObject = EmberObject.extend(StoreMixin);
  let subject = StoreObject.create();
  assert.ok(subject);
});
