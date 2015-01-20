define(function(require) {

	var Radio = require('backbone.radio');
	var TabbedView = require('view/tabbed');
	var Template = require('text!template/slides.html');
	var getView = require('lib/get_view_for_slide');
	var addViews = require('lib/add_view_to_slides');

	var channel = Backbone.Radio.channel('tabs');
	var main_channel = Backbone.Radio.channel('main');

	var nested_slides = [
		{ id: 'apple', label: 'Apple' },
		{ id: 'banana', label: 'Banana' },
		{ id: 'carrot', label: 'Carrot' },
	];

	addViews(nested_slides);

	var NestedView = TabbedView.extend({
		tabOptions: {
			scope: 'tabbed-views/anatomy',
			tabs: nested_slides
		}
	});


	var AnatomyView = getView('anatomy');

	AnatomyView = AnatomyView.extend({
		regions: {
			'nested_region': '.nested-region'
		},
		onRender: function() {
			var nested_view = new NestedView();
			this.nested_region.show(nested_view);
		}
	});

	var CodeSampleView = getView('tabs-code').extend({
		onRender: function() {
			var code = $(Template).filter('script.tabs-code-sample').html();
			this.$('pre').text(code.trim());
		}
	});

	var GoalsView = getView('goals').extend({
		events: {
			'click .dynamically': 'toggleTab'
		},
		toggleTab: function() {
			main_channel.command('toggle:tab', 'routing');
		}
	});

	var slides = [
		{ id: 'goals', label: 'Goals', view: GoalsView },
		{ id: 'anatomy', label: 'Anatomy', view: AnatomyView },
		{ id: 'code', label: 'Code', view: CodeSampleView },
		{ id: 'examples', label: 'Examples' },
	];

	addViews(slides);

	var TabsView = TabbedView.extend({
		tabOptions: {
			scope: 'tabbed-views',
			tabs: slides
		},
		initialize: function() {
			TabbedView.prototype.initialize.apply(this, arguments);
			channel.comply('toggle:tab', this.toggleTab, this)
		},
		toggleTab: function() {
			var tab = this.tabs.collection.findWhere({'id':'examples'})
			var visible = tab.get('visible');
			tab.set('visible', ! visible);
		}

	});

	return TabsView;

});
