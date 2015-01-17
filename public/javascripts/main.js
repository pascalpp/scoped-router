define(function(require) {

	var Marionette = require('marionette');
	var TabbedView = require('view/tabbed');
	var SlidesView = require('view/slides');
	var DontsView = require('view/donts');
	var SlideView = require('view/slide');
	var Tabs = require('lib/behavior.tabs');
	var Template = require('text!template/slides.html');

	var AboutMeView = SlideView.extend({
		template: _.template($(Template).filter('script.aboutme').html())
	});

	var MainView = TabbedView.extend({
		tabOptions: function() {
			return {
				scope: '',
				tabs: [
					{ id: 'aboutme', label: 'Me', view: AboutMeView },
					{ id: 'tabs', label: 'Tabbed Views', view: SlidesView },
					{ id: 'dont', label: 'Don’ts', view: DontsView },
				]
			};
		}
	});


	var main_region = new Marionette.Region({
		el: '.main-region'
	});

	var main_view = new MainView();

	// create the app
	var app = new Marionette.Application();

	// define global regions
	app.addRegions({
		region: '.main-region'
	});

	app.addInitializer(function(options) {
		app.region.show(main_view);
	});

	app.start();


});
