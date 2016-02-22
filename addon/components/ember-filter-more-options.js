import Ember from 'ember';
import layout from '../templates/components/ember-filter-more-options';

export default Ember.Component.extend({
	layout: layout,
	actions:{
		showField(key){
			this.get('parentView').showField(key);
		}
	}
});

