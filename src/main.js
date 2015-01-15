define(function(require) {

	var Marionette = require('marionette');
	var Router = require('lib/router');
	var Tabs = require('lib/behavior.tabs');

	var SlidesView = Marionette.LayoutView.extend({
		template: _.template('<div class="tab-nav"></div><div class="tab-content"></div>'),
		regions: {
			nav: '.tab-nav',
			content: '.tab-content',
		},
		behaviors: function() {
			return {
				Tabs: {
					behaviorClass: Tabs,
					scope: 'slides',
					region: this.content,
					tabs: [
						{
							id: 'slide1',
							label: 'Slide 1',
							view: Marionette.LayoutView.extend({
								template: _.template('Content for slide 1')
							}),
						},
						{
							id: 'slide2',
							label: 'Slide 2',
							view: Marionette.LayoutView.extend({
								template: _.template('Content for slide 2')
							}),
						},
					],
					nav: {
						region: this.nav
					}
				}
			};
		}
	});

	var main_region = new Marionette.Region({
		el: '.main-region'
	});

	var slides_view = new SlidesView();

	main_region.show(slides_view);

});
