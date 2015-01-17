define(function(require) {

	var TabbedView = require('view/tabbed');
	var getView = require('lib/get_view_for_slide');
	var addViews = require('lib/add_view_to_slides');


	var nested_slides = [
		{ id: 'apple', label: 'Apple' },
		{ id: 'banana', label: 'Banana'  },
		{ id: 'carrot', label: 'Carrot'  },
	];

	addViews(nested_slides);

	var NestedView = TabbedView.extend({
		tabOptions: {
			scope: 'tabs/anatomy',
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

	var slides = [
		{ id: 'goals', label: 'Goals' },
		{ id: 'anatomy', label: 'Anatomy', view: AnatomyView },
		{ id: 'examples', label: 'Examples' },
	];

	addViews(slides);

	var SlidesView = TabbedView.extend({
		tabOptions: {
			scope: 'tabs',
			tabs: slides
		}
	});

	return SlidesView;

});
