import Ember from 'ember';
import layout from '../templates/components/ember-filter-form';
const { get } = Ember;

export default Ember.Component.extend({
  layout: layout,
  _updateContent(){
    let $this = this;
    let store = get(this.parentView, 'store');
    let filter = this.get('filter');
    let type = this.get('type');
    let payload = this.get('payload');
    let filterOptions = this.get('filterOptions');
    return store.filter(type, filter.id, filterOptions).then(function(items){
      $this.parentView.set(payload, items);
    });
  },

  actions: {
    customSearch: function(){
      this._updateContent();
    }
  }
});
