define(function(require) {

	var TabbedView = require('view/tabbed');
	var getView = require('lib/get_view_for_slide');
	var addViews = require('lib/add_view_to_slides');


	var nested_slides = [
		{ id: 'apple', label: 'A' },
		{ id: 'banana', label: 'B'  },
		{ id: 'carrot', label: 'C'  },
		{ id: 'moreexamples', label: 'More' },
	];

	addViews(nested_slides);

	var NestedView = TabbedView.extend({
		tabOptions: {
			scope: 'tabs/examples',
			tabs: nested_slides
		}
	});


	var ExampleView = getView('examples');

	ExampleView = ExampleView.extend({
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
		{ id: 'examples', label: 'Examples', view: ExampleView },
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
