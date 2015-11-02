import Ember from 'ember';
import layout from '../templates/components/ember-filter-form';
const { get } = Ember;

export default Ember.Component.extend({
  layout: layout,
  actions: {
    customSearch: function(type, payload){
      let $this = this,
          store = get(this.parentView, 'store'),
          filter = this.get('filter');
      return store.filter(type, filter.id).then(function(items){
        $this.parentView.set(payload, items);
      });
    }
  }
});
