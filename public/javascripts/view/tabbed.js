define(function(require) {

	var Marionette = require('marionette');
	var Tabs = require('lib/behavior.tabs');


	var tabbed_views = [];

	function handleKeyPress(e) {
		var tabbed_view = _.last(tabbed_views);
		if (! tabbed_view) return;

		var current_tab = tabbed_view.tabs.model.get('current_tab_id');

		switch(e.which) {
			case 37:
				var first_tab = tabbed_view.tabs.collection.first().get('id');
				if (first_tab === current_tab) {
					tabbed_views.pop();
					handleKeyPress(e);
				} else {
					tabbed_view.triggerMethod('previous');
				}
				break;
			case 39:
				var last_tab = tabbed_view.tabs.collection.last().get('id');
				if (last_tab === current_tab) {
					tabbed_views.pop();
					handleKeyPress(e);
				} else {
					tabbed_view.triggerMethod('next');
				}
				break;
			default:
				console.log(e.which);
		}
	}

	$(window).on('keyup', handleKeyPress);


	var TabbedView = Marionette.LayoutView.extend({
		template: _.template('<div class="tab-nav"></div><div class="tab-content"></div>'),
		regions: {
			nav: '.tab-nav',
			content: '.tab-content',
		},
		initialize: function() {
			tabbed_views.push(this);
		},
		onBeforeDestroy: function() {
			tabbed_views = _.filter(tabbed_views, function(view) {
				return (view.cid !== this.cid);
			}, this);
		},
		behaviors: function() {
			var tab_options = _.extend({
				behaviorClass: Tabs,
				region: this.content,
				tabs: [],
				nav: {
					region: this.nav
				}
			}, _.result(this, 'tabOptions'));

			return {
				Tabs: tab_options
			};
		}
	});

	return TabbedView;

});
