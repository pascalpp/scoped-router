define(function(require) {

	var TabbedView = require('view/tabbed');
	var Template = require('text!template/slides.html');
	var SlideView = require('view/slide');
	var getView = require('lib/get_view_for_slide');
	var addViews = require('lib/add_view_to_slides');


	var slides = [
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
