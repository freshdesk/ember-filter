import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('ember-filter-form-element', 'Integration | Component | ember filter form element', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ember-filter-form-element}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#ember-filter-form-element}}
      template block text
    {{/ember-filter-form-element}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
