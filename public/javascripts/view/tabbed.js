define(function(require) {

	var Marionette = require('marionette');
	var Tabs = require('lib/behavior.tabs');

	var TabbedView = Marionette.LayoutView.extend({
		template: _.template('<div class="tab-nav"></div><div class="tab-content"></div>'),
		regions: {
			nav: '.tab-nav',
			content: '.tab-content',
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
