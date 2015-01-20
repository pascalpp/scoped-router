define(function(require) {

	var Marionette = require('marionette');
	var Radio = require('backbone.radio');
	var Tabs = require('lib/behavior.tabs');
	var TabbedView = require('view/tabbed');
	var SlideView = require('view/slide');
	var TabsSlide = require('slides/tabs');
	var RoutingSlide = require('slides/routing');
	var DontsSlide = require('slides/donts');
	var getSlide = require('lib/get_view_for_slide');
	var Template = require('text!template/slides.html');
	require('lib/addPrefixedClass');

	var AboutMeSlide = SlideView.extend({
		template: _.template($(Template).filter('script.aboutme').html())
	});

	var main_channel = Backbone.Radio.channel('main');

	var MainView = TabbedView.extend({
		initialize: function() {
			TabbedView.prototype.initialize.apply(this, arguments);
			main_channel.comply('show:scope', this.showScope, this);
			main_channel.comply('toggle:tab', this.toggleTab, this);
		},
		showScope: function(which) {
			if (which) {
				this.$el.addPrefixedClass('scope', which);
			} else {
				this.$el.removePrefixedClass('scope');
			}
		},
		toggleTab: function(id) {
			var tab = this.tabs.collection.findWhere({'id': id})
			if (! tab) return;
			var visible = tab.get('visible');
			tab.set('visible', ! visible);
		},
		tabOptions: function() {
			return {
				scope: '',
				tabs: [
					{ id: 'intro', label: 'Intro', view: getSlide('intro') },
					{ id: 'aboutme', label: 'About Me', view: AboutMeSlide },
					{ id: 'tabbed-views', label: 'Tabbed Views', view: TabsSlide },
					{ id: 'routing', label: 'Routing', view: RoutingSlide },
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
