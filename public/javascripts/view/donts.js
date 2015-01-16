define(function(require) {

	var TabbedView = require('view/tabbed');
	var Template = require('text!template/slides.html');
	var SlideView = require('view/slide');


	var getView = function(id) {
		var View = SlideView.extend({
			template: _.template($(Template).filter('script.'+id).html())
		});
		return View;
	}

	var slides = [
		{ id: 'goals', label: 'Don’t One' },
		{ id: 'examples', label: 'Don’t Two' },
	];

	_.each(slides, function(slide) {
		if (! slide.view) {
			slide.view = getView(slide.id);
		}
	});

	var DontsView = TabbedView.extend({
		tabOptions: {
			scope: 'donts',
			tabs: slides
		}
	});

	return DontsView;

});
