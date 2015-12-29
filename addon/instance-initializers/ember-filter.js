import DS from 'ember-data';
import StoreMixin from 'ember-filter/mixins/store';

export function initialize({ application, container }) {
  var store = container.lookup('service:store');
  store.reopen(StoreMixin);

  let filterStore = 'filter-store:application';
  store.set('filterStore', container.lookup(filterStore));
}

export default {
  name: 'ember-filter',
  initialize: initialize
};
