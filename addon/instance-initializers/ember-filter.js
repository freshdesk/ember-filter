import DS from 'ember-data';
import StoreMixin from 'ember-filter/mixins/store';
import AdapterMixin from 'ember-filter/mixins/adapter';
const{ Adapter } = DS;

export function initialize({ container }) {
  var store = container.lookup('service:store');
  store.reopen(StoreMixin);
  Adapter.reopen(AdapterMixin);
}

export default {
  name: 'ember-filter',
  initialize: initialize
};
