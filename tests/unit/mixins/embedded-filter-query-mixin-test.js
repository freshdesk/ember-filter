import EmberObject from '@ember/object';
import EmbeddedFilterQueryMixinMixin from 'ember-filter/mixins/embedded-filter-query-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | embedded filter query mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let EmbeddedFilterQueryMixinObject = EmberObject.extend(EmbeddedFilterQueryMixinMixin);
  let subject = EmbeddedFilterQueryMixinObject.create();
  assert.ok(subject);
});
