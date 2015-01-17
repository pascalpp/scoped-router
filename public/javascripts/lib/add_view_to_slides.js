define(function(require) {
	'use strict';

	var getView = require('lib/get_view_for_slide');

	var addViews = function(slides) {
		_.each(slides, function(slide) {
			if (! slide.view) {
				slide.view = getView(slide.id);
			}
		});
	};

	return addViews;

});
