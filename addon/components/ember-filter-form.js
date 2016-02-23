import Ember from 'ember';
import layout from '../templates/components/ember-filter-form';
const {
  computed,
  isPresent,
  isEmpty
} = Ember;

export default Ember.Component.extend({
  layout: layout,
  classNames: ['filter-form'],

  moreOptionTemplate: 'ember-filter-more-options',

  searchButtonTemplate: 'ember-filter-search-button',


  visibleFilterOptions: computed('filter', function(){
    var $this=this;
    var normalizedQuery = this.get('filter.normalizedQuery');
    var allFilterOptions = this.get('allFilterOptions');
    var elms = new Ember.Object();
    Object.keys(normalizedQuery).forEach(function(key){
      if(allFilterOptions || normalizedQuery[key].value instanceof Ember.ArrayProxy || isPresent(normalizedQuery[key].value)){
        elms[key] = $this.filterOptionsFor(key);
      }
    });
    return elms;
  }),

  nonVisibleOptions: computed('filter', 'visibleFilterOptions', function(){
    var $this =this;
    var filterOptions = this.get('filter.filterOptions');
    var visibleFilterOptions = this.get('visibleFilterOptions');
    var elms = new Ember.Object();
    Object.keys(filterOptions).forEach(function(key){
      if(isEmpty(visibleFilterOptions[key])){
        elms[key] = $this.filterOptionsFor(key);
      }
    });
    return elms;
  }),

  hasMoreElements: computed('filter', 'visibleFilterOptions', function(){
    return Object.keys(this.get('nonVisibleOptions')).length > 0;
  }),

  filterOptionsFor(key){
    return this.get('filter.filterOptions.'+key);
  },

  showField(key){
    var visibleFilterOptions = this.get('visibleFilterOptions');
    visibleFilterOptions[key] = this.filterOptionsFor(key);
    this.set('visibleFilterOptions', visibleFilterOptions);
    this.notifyPropertyChange('visibleFilterOptions');
  },  

  actions: {
    customSearch: function(){
      this.sendAction('action');
    }
  }
});
