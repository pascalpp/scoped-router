define(function(require) {

	var TabbedView = require('view/tabbed');
	var Template = require('text!template/slides.html');

	var SlidesView = TabbedView.extend({
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
		tabOptions: function() {
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
				scope: 'slides',
				tabs: slides,
			};
		}
	});

	return SlidesView;

});
