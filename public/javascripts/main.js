define(function(require) {

	var Marionette = require('marionette');
	var Router = require('lib/router');
	var Tabs = require('lib/behavior.tabs');
	var Template = require('text!template/slides.html');

	var SlidesView = Marionette.LayoutView.extend({
		template: _.template('<div class="tab-nav"></div><div class="tab-content"></div>'),
		regions: {
			nav: '.tab-nav',
			content: '.tab-content',
		},
		initialize: function() {
			_.bindAll(this, 'onKeyup');
			$(window).on('keyup', this.onKeyup);
		},
		onKeyup: function(e) {
			switch(e.which) {
				case 37:
					this.triggerMethod('previous');
					break;
				case 39:
					this.triggerMethod('next');
					break;
				default:
					console.log(e.which);
			}
		},
		behaviors: function() {
			var slides = [];
			for (var i=1; i<=5; i++) {
				var slide = {
					id: 'slide'+i,
					label: i,
					view: Marionette.LayoutView.extend({
						template: _.template($(Template).filter('script.slide-'+i).html())
					})
				};
				slides.push(slide);
			}

			return {
				Tabs: {
					behaviorClass: Tabs,
					wraparound: true,
					scope: 'slides',
					region: this.content,
					tabs: slides,
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
