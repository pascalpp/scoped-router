define(function(require) {

	var Marionette = require('marionette');
	var TabbedView = require('view/tabbed');
	var SlidesView = require('view/slides');

	var MainView = TabbedView.extend({
		tabOptions: function() {
			return {
				scope: '',
				tabs: [
					{ id: 'slides', label: 'Slides', view: SlidesView },
					{ id: 'dont', label: 'Don’t Do This', view: MainView },
				]
			};
		}
	});


	var main_region = new Marionette.Region({
		el: '.main-region'
	});

	var main_view = new MainView();

	main_region.show(main_view);

});
