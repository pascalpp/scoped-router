define(function(require) {

	var TabbedView = require('view/tabbed');
	var Template = require('text!template/slides.html');
	var SlideView = require('view/slide');
	var getView = require('lib/get_view_for_slide');
	var addViews = require('lib/add_view_to_slides');


	var nested_slides = [
		{ id: 'scopes', label: 'Scopes' },
		{ id: 'router', label: 'Router' },
		{ id: 'destroy', label: 'Destroyable' },
	];

	addViews(nested_slides);

	var NestedView = TabbedView.extend({
		tabOptions: {
			scope: 'routing/needs',
			tabs: nested_slides
		}
	});


	var NeedView = getView('needs');

	NeedView = NeedView.extend({
		regions: {
			'nested_region': '.nested-region'
		},
		onRender: function() {
			var nested_view = new NestedView();
			this.nested_region.show(nested_view);
		}
	});
	var slides = [
		{ id: 'needs', label: 'What We Need', view: NeedView },
		{ id: 'backbone', label: 'Backbone Routing' },
		{ id: 'limitations', label: 'Limitations' },
		{ id: 'caution', label: 'Caution' },
	];

	addViews(slides);


	var RoutingSlide = TabbedView.extend({
		tabOptions: {
			scope: 'routing',
			tabs: slides
		}
	});

	return RoutingSlide;

});
