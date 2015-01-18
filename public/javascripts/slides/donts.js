define(function(require) {

	var TabbedView = require('view/tabbed');
	var Template = require('text!template/slides.html');
	var SlideView = require('view/slide');
	var getView = require('lib/get_view_for_slide');
	var addViews = require('lib/add_view_to_slides');


	var slides = [
		{ id: 'dont1', label: 'Don’t One' },
		{ id: 'dont2', label: 'Don’t Two' },
	];

	addViews(slides);

	var DontsView = TabbedView.extend({
		tabOptions: {
			scope: 'donts',
			tabs: slides
		}
	});

	return DontsView;

});
