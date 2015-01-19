define(function(require) {

	var TabbedView = require('view/tabbed');
	var Template = require('text!template/slides.html');
	var SlideView = require('view/slide');
	var getView = require('lib/get_view_for_slide');
	var getNestedView = require('lib/get_nested_view');
	var addViews = require('lib/add_view_to_slides');

	var main_channel = Backbone.Radio.channel('main');

	var ScopesView = getView('scopes');
	ScopesView = ScopesView.extend({
		events: {
			'mouseover li span': 'showScope',
			'mouseover li': 'showScope',
			'mouseout li': 'hideScope',
		},
		showScope: function(e) {
			var li = $(e.target).closest('li');
			li.addClass('highlight');
			var index = li.index() + 1;
			main_channel.command('show:scope', index);
		},
		hideScope: function() {
			this.$('ul .highlight').removeClass('highlight');
			main_channel.command('show:scope');
		}
	});

	var needed_slides = [
		{ id: 'scopes', label: 'Scopes', view: ScopesView },
		{ id: 'router', label: 'Router' },
		{ id: 'destroy', label: 'Destroyable' },
	];

	addViews(needed_slides);

	var NestedView = TabbedView.extend({
		tabOptions: {
			scope: 'routing/needs',
			tabs: needed_slides
		}
	});


	var NeedView = getNestedView('needs', NestedView);


	var slides = [
		{ id: 'backbone', label: 'Backbone Routing' },
		{ id: 'limitations', label: 'Limitations' },
		{ id: 'needs', label: 'What We Need', view: NeedView },
		{ id: 'caution', label: 'Caution' },
	];

	addViews(slides);


	var RoutingSlide = TabbedView.extend({
		tabOptions: {
			scope: 'routing',
			tabs: slides
		}
	});

	return RoutingSlide;

});
