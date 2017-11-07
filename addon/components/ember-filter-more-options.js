import Component from '@ember/component';
import layout from '../templates/components/ember-filter-more-options';

export default Component.extend({
	layout: layout,
	actions:{
		showField(key){
			this.get('parentView').showField(key);
		}
	}
});

