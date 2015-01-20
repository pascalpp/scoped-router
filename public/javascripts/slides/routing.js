define(function(require) {

	var TabbedView = require('view/tabbed');
	var Template = require('text!template/slides.html');
	var SlideView = require('view/slide');
	var getView = require('lib/get_view_for_slide');
	var getNestedView = require('lib/get_nested_view');
	var addViews = require('lib/add_view_to_slides');

	var main_channel = Backbone.Radio.channel('main');

	var backbone_slides = [
		{ id: 'appstart', label: 'App Initialization' },
		{ id: 'apprunning', label: 'While Your App Is Running' },
		{ id: 'limitations', label: 'Limitations' },
	];

	addViews(backbone_slides);

	var BackboneNestedView = TabbedView.extend({
		tabOptions: {
			scope: 'routing/backbone',
			tabs: backbone_slides
		}
	});

	var BackboneView = getNestedView('backbone', BackboneNestedView);

	var NeedsView = getView('needs').extend({
		events: {
			'mouseover li.scope': 'showScope',
		},
		showScope: function(e) {
			var li = $(e.target).closest('li');
			var scope = li.data('scope');
			main_channel.command('show:scope', scope);
		},
		hideScope: function() {
			main_channel.command('show:scope');
		},
		onBeforeDestroy: function() {
			this.hideScope();
		}
	});


	var ScopesView = getView('scopes').extend({
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
		},
		onBeforeDestroy: function() {
			this.hideScope();
		}
	});

	var RouterView = getView('router').extend({
		onRender: function() {
			this.$el.addClass('code-annotations');
			var code = $(Template).filter('script.router-code-sample').html();
			this.$('pre').html(code.trim());
			this.bindUIElements();
		},
		ui: {
			codenotes: 'pre .note',
			sidenotes: '.sidenotes .note'
		},
		events: {
			'mouseover pre .note': 'showNote',
			'mouseout pre .note': 'hideNotes'
		},
		showNote: function(e) {
			e.stopPropagation();
			this.hideNotes();
			var note = $(e.target).addClass('active').data('note');
			if (! note) return;
			this.ui.sidenotes.filter('.note-'+note).show();
		},
		hideNotes: function() {
			this.ui.codenotes.removeClass('active');
			this.ui.sidenotes.hide();
		}
	});

	var BehaviorCodeSampleView = getView('tabs-code').extend({
		onRender: function() {
			this.$el.addClass('code-annotations');
			var code = $(Template).filter('script.tabs-code-sample').html();
			this.$('pre').html(code.trim());
			this.bindUIElements();
		},
		ui: {
			codenotes: 'pre .note',
			sidenotes: '.sidenotes .note'
		},
		events: {
			'mouseover pre .note': 'showNote',
			'mouseout pre .note': 'hideNotes'
		},
		showNote: function(e) {
			e.stopPropagation();
			this.hideNotes();
			var note = $(e.target).addClass('active').data('note');
			if (! note) return;
			this.ui.sidenotes.filter('.note-'+note).show();
		},
		hideNotes: function() {
			this.ui.codenotes.removeClass('active');
			this.ui.sidenotes.hide();
		}
	});

	var solution_slides = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'scopes', label: 'Scopes', view: ScopesView },
		{ id: 'router', label: 'Router', view: RouterView },
		{ id: 'behavior', label: 'View Behavior', view: BehaviorCodeSampleView },
		{ id: 'initialize', label: 'Router.initialize' },
		{ id: 'createroute', label: 'Router.route' },
		{ id: 'navigate', label: 'Router.navigate' },
		{ id: 'destroy', label: 'View.destroy' },
	];

	addViews(solution_slides);

	var SolutionNestedView = TabbedView.extend({
		tabOptions: {
			scope: 'routing/solution',
			tabs: solution_slides
		}
	});

	var SolutionView = getNestedView('solution', SolutionNestedView);


	var routing_slides = [
		{ id: 'backbone', label: 'Backbone Routing', view: BackboneView },
		{ id: 'needs', label: 'What We Need', view: NeedsView },
		{ id: 'solution', label: 'Our Solution', view: SolutionView },
		{ id: 'tryit', label: 'Try It Out' },
		{ id: 'caution', label: 'Caution' },
	];

	addViews(routing_slides);


	var RoutingSlide = TabbedView.extend({
		tabOptions: {
			scope: 'routing',
			tabs: routing_slides
		}
	});

	return RoutingSlide;

});
