define(function(require) {
	'use strict';

	var Template = require('text!template/slides.html');
	var SlideView = require('view/slide');

	/* helper method for demo presentation */
	var getView = function(id) {
		var template = $(Template).filter('script.'+id);
		if (! template || ! template.length) throw 'No template found for ' + id;
		var View = SlideView.extend({
			template: _.template(template.html())
		});
		return View;
	};

	return getView;

});
