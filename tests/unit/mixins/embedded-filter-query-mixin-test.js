import Ember from 'ember';
import EmbeddedFilterQueryMixinMixin from '../../../mixins/embedded-filter-query-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | embedded filter query mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var EmbeddedFilterQueryMixinObject = Ember.Object.extend(EmbeddedFilterQueryMixinMixin);
  var subject = EmbeddedFilterQueryMixinObject.create();
  assert.ok(subject);
});
