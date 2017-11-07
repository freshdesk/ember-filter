import ArrayProxy from '@ember/array/proxy';
import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';
import layout from '../templates/components/ember-filter-form';

export default Component.extend({
  layout: layout,
  classNames: ['filter-form'],

  moreOptionTemplate: 'ember-filter-more-options',

  searchButtonTemplate: 'ember-filter-search-button',


  visibleFilterOptions: computed('filter', function(){
    var normalizedQuery = this.get('filter.normalizedQuery');
    var allFilterOptions = this.get('allFilterOptions');
    var elms = new EmberObject();
    Object.keys(normalizedQuery).forEach((key)=>{
      var option = this.filterOptionsFor(key);
      if(allFilterOptions || option.visible || normalizedQuery[key].value instanceof ArrayProxy || isPresent(normalizedQuery[key].value)){
        elms[key] = option;
      }
    });
    return elms;
  }),

  nonVisibleOptions: computed('filter', 'visibleFilterOptions', function(){
    var filterOptions = this.get('filter.filterOptions');
    var visibleFilterOptions = this.get('visibleFilterOptions');
    var elms = new EmberObject();
    Object.keys(filterOptions).forEach((key)=>{
      if(isEmpty(visibleFilterOptions[key])){
        elms[key] = this.filterOptionsFor(key);
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
