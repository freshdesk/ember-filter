import StoreMixin from 'ember-filter/mixins/store';

export function initialize(application) {
  var store = application.lookup('service:store');
  store.reopen(StoreMixin);

  let filterStore = 'filter-store:application';
  store.set('filterStore', application.lookup(filterStore));
}

export default {
  name: 'ember-filter',
  initialize: initialize
};
