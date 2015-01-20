define(function(require) {
	'use strict';

	var Template = require('text!template/slides.html');
	var getView = require('lib/get_view_for_slide');

	/* helper method for demo presentation */
	var getNestedView = function(id, NestedView) {
		var View = getView(id).extend({
			regions: {
				'nested_region': '.nested-region'
			},
			onRender: function() {
				var nested_view = new NestedView();
				this.nested_region.show(nested_view);
			}
		});
		return View;
	};

	return getNestedView;

});
