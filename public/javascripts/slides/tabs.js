define(function(require) {

	var TabbedView = require('view/tabbed');
	var Template = require('text!template/slides.html');
	var getView = require('lib/get_view_for_slide');
	var addViews = require('lib/add_view_to_slides');


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

	var CodeSampleView = getView('tabs-code');

	CodeSampleView = CodeSampleView.extend({
		onRender: function() {
			var code = $(Template).filter('script.tabs-code-sample').html();
			this.$('pre').text(code.trim());
		}
	});

	var slides = [
		{ id: 'goals', label: 'Goals' },
		{ id: 'examples', label: 'Examples' },
		{ id: 'anatomy', label: 'Anatomy', view: AnatomyView },
		{ id: 'code', label: 'Code', view: CodeSampleView },
	];

	addViews(slides);

	var SlidesView = TabbedView.extend({
		tabOptions: {
			scope: 'tabbed-views',
			tabs: slides
		}
	});

	return SlidesView;

});
