define(function(require) {
	'use strict';

	/* MODULE DEPENDENCIES */
	var
	Backbone		= require('backbone'),
	Marionette		= require('marionette'),
	Router			= require('./router');


	var controller;

	var Controller = Marionette.Controller.extend({
		initialize: function() {
			console.log('controller initialize');
			this.cid = _.uniqueId('controller');
			this.scope_model = new Backbone.Model();
		},
		setCurrentTabIdForScope: function(scope, tab_id) {
			if (! scope) return;
			if (! tab_id) throw 'tab_id required';
			this.scope_model.set(scope, tab_id);
		},
		getCurrentTabIdForScope: function(scope) {
			return this.scope_model.get(scope) || '';
		},
	});


	var Tab = Backbone.Model.extend({
		defaults: {
			destroy: true,
			viewOptions: {},
			visible: true,
		},

		initialize: function() {
			// inherit superclass initialize
			Backbone.Model.prototype.initialize.apply(this, arguments);

			// if view attribute is not a generator, set destroy to false
			// so view can be re-used. not advisable for most use cases.
			//this.set('destroy', _.isFunction(this.get('view')));
			//log(this.get('id'), this.get('destroy'));

			this.on('invalid', function() {
				console.error(this.get('id'), this.validationError);
			});

			if (this.get('id') === 'saved') window.footab = this; // DNR


		},
		getView: function() {
			var View = this.get('view');
			var view = new View(this.get('viewOptions'));
			view.$el.addClass('tab tab-'+this.get('id'));
			return view;
		},
		validate: function(attrs) {
			if (! attrs.id) {
				return 'Tab requires an id.';
			}

			if (! attrs.view) {
				return 'Tab requires a view.';
			}

			if (! (attrs.view.prototype instanceof Backbone.View)) {
				return 'Tab view must be a Backbone.View';
			}

			if (! _.isObject(attrs.viewOptions)) {
				return 'Tab viewOptions must be an object';
			}

			if (! attrs.label) {
				return 'Tab requires a label.';
			}
		}
	});

	var TabList = Backbone.Collection.extend({
		model: Tab
	});

	var ButtonBarItemView = Marionette.ItemView.extend({
		tagName: 'span',
		className: 'button',
		template: _.template('<%= label %>'),
		initialize: function() {
			this.$el.addClass('tabset-item');
		},
		triggers: {
			'click': 'item:click'
		}
	});
	var ButtonBarView = Marionette.CollectionView.extend({
		tagName: 'div',
		className: 'buttonbar',
		childView: ButtonBarItemView,
		initialize: function(options) {
		    this.rc = 0;
			if (! options.tabs) throw new Error('Tabnav requires tabs.');
			this.tabs = options.tabs;
			this.collection = options.tabs.collection;
			this.listenTo(this.tabs.model, 'change:current_tab_id', this.setActiveItem);
			this.listenTo(this, 'render', this.setActiveItem);
			// experimental support for tab.visible property
			this.listenTo(this.collection, 'change:visible', this.onChangeTabVisible);
			window.foobuttons = this; // DNR
		},
		onEvent: function() {
			console.log(arguments);
		},
		childEvents: {
			'item:click': 'onClickItem'
		},
		onClickItem: function(child) {
			this.tabs.setCurrentTabId(child.model.get('id'));
		},
		setActiveItem: function() {
			console.log(this.tabs.options.scope, 'setActiveItem');
			this.$el.find('.active').removeClass('active');
			var tab = this.tabs.getCurrentTab();
			if (tab) {
				var view = this.children.findByModel(tab);
				view.$el.addClass('active');
			}
		},

		// experimental support for tab.visible property
		showCollection: function() {
			// override parent method to ignore tabs with visible:false
			var ChildView;
			var visible_children = this.collection.where({ visible: true });

			_(visible_children).each(function(child, index) {
				ChildView = this.getChildView(child);
				this.addChild(child, ChildView, index);
			}, this);
		},
		// experimental support for tab.visible property
		onChangeTabVisible: function(tab, visible, options) {
			if (visible) {
				// some hidden tab is now visible
				// re-render rather than try to figure out where to insert it
				this.render();
			} else {
				// remove the view for this tab
				// and show the previous adjacent tab, or the first tab
				var previous_tab_index = this.collection.indexOf(tab) - 1 || 0;
				var view = this.children.findByModel(tab);
				view.remove();
				this.tabs.showTabByIndex(previous_tab_index);
			}
		}
	});

	var MenuItemView = Marionette.ItemView.extend({
		tagName: 'option',
		template: _.template('<%= label %>'),
		initialize: function() {
			this.$el.attr('value', this.model.cid);
		}
	});
	var MenuView = Marionette.CollectionView.extend({
		tagName: 'select',
		className: 'tabmenu',
		childView: MenuItemView,
		initialize: function(options) {
			if (! options.tabs) throw new Error('Tabnav requires tabs.');
			this.tabs = options.tabs;
			this.collection = options.tabs.collection;
			this.listenTo(this.tabs.model, 'change:current_tab_id', this.setActiveItem);
			this.listenTo(this, 'render', this.setActiveItem);
		},
		events: {
			'change': 'onSelectItem'
		},
		onRender: function() {
			this.$el.prepend('<option disabled>Select one:</option>');
		},
		onSelectItem: function() {
			var cid = this.$el.val();
			var tab = this.collection.get(cid);
			this.tabs.setCurrentTabId(tab.get('id'));
		},
		setActiveItem: function() {
			var tab = this.tabs.getCurrentTab();
			if (tab && tab.cid) this.$el.val(tab.cid);
		}
	});


	var Tabs = Marionette.Behavior.extend({

		initialize: function() {
			this.options = this.options || {};

			// validate options
			_.defaults(this.options, {
				tabs: [],
				show_initial_tab: true,
				initial_tab_id: '',
				wraparound: false
			});
			if (! this.options.region) throw new Error('Tabs behavior requires a region');

			this.cid = _.uniqueId('tabs');
			console.log('tabs init', this.options.scope, this.cid);
			this.view.tabs = this;


			// set up central controller
			if (! controller) controller = new Controller();

			// if this.options.initial_tab_id isn't set explicitly,
			// use the last tab shown for this scope, if defined by a previous tab instance
			if (! this.options.initial_tab_id) {
				var initial_tab_id = controller.getCurrentTabIdForScope(this.options.scope);
				if (initial_tab_id) this.options.initial_tab_id = initial_tab_id;
			}

			if (! _.isUndefined(this.options.scope)) {
				this.router = new Router({
					controller: this,
					scope: this.options.scope,
					appRoutes: {
						'(:tab_id)(/)(*params)': 'routeTabId'
					}
				});
			}

			// set up view model and tablist
			this.model = new Backbone.Model({ current_tab_id: this.options.initial_tab_id });
			this.collection = new TabList();

			_.bindAll(this, 'autoShowFirstTab');
			this.autoShowFirstTab = _.debounce(this.autoShowFirstTab, 20);

			window.footabs = this; // DNR
		},

		onShow: function() {
			console.log('tabs show');

			// set up model events
			this.listenTo(this.model, 'change:current_tab_id', this.onChangeCurrentTabId);
			this.on('next', this.showNextTab);
			this.on('previous', this.showPreviousTab);

			this.addTabs(this.options.tabs);

			if (this.options.nav) this.createNav();

			_.defer(this.autoShowFirstTab);
		},

		onDestroy: function() {
			console.log('tabs destroy');
			if (this.router) this.router.destroy();
		},

		onChangeCurrentTabId: function(model, tab_id, options) {
			console.log('onChangeCurrentTabId', arguments);
			this.showCurrentTab(options);
			controller.setCurrentTabIdForScope(this.options.scope, this.model.get('current_tab_id'));
		},

		addTab: function(tab) {
			if (! (tab instanceof Tab)) tab = new Tab(tab);
			if (! tab.isValid()) return tab.validationError;

			this.collection.add(tab);

		},

		addTabs: function(tabs) {
			_.each(tabs, function(tab) {
				this.addTab(tab);
			}, this);
		},

		getTabById: function(tab_id) {
			return this.collection.findWhere({id:tab_id});
		},


		getCurrentTab: function() {
		    var tab_id = this.model.get('current_tab_id');
			return this.getTabById(tab_id);
		},

		showCurrentTab: function(options) {
			console.log('showCurrentTab', this.options.scope, options);
			options = options || {};

			var tab = this.getCurrentTab();

			if (tab && tab.isValid()) {
				if (tab.get('shown')) return console.log('tab already showing');

				var last_tab_id = this.model.get('last_tab_id'),
					last_tab = this.getTabById(last_tab_id);
				if (last_tab) {
					options.preventDestroy = ! last_tab.get('destroy');
				}

				var tab_view = tab.getView();
				this.view.triggerMethod('before:show:tab', tab_view);
				this.options.region.show(tab_view, options);
				tab.set('shown', true);
				this.listenTo(tab_view, 'destroy', function() {
					tab.unset('shown');
				});
				this.view.triggerMethod('show:tab', tab_view);
				this.setHistory(options);
			}
		},

		routeTabId: function(tab_id) {
			this.setCurrentTabId(tab_id);
		},

		setCurrentTabId: function(tab_id, options) {
			options = options || {};
			var tab = this.getTabById(tab_id);
			if (tab && tab.isValid()) {
				var last_tab_id = this.model.get('current_tab_id');
				this.model.set('last_tab_id', last_tab_id, options);
				this.model.set('current_tab_id', tab_id, options);
			}
		},

		showTabById: function(tab_id, options) {
			this.setCurrentTabId(tab_id, options);
		},

		showTabByIndex: function(n) {
			if (this.options.wraparound) {
				if (n < 0) n = this.collection.length - 1;
				if (n > this.collection.length - 1) n = 0;
			} else {
				n = Math.max(0, n);
				n = Math.min(n, this.collection.length - 1);
			}
			var tab = this.collection.at(n);
			this.setCurrentTabId(tab.get('id'));
		},

		showNextTab: function() {
			var tab = this.getCurrentTab(),
				index = this.collection.indexOf(tab);

			index++;
			this.showTabByIndex(index);
		},

		showPreviousTab: function() {
			var tab = this.getCurrentTab(),
				index = this.collection.indexOf(tab);

			index--;
			this.showTabByIndex(index);
		},

		autoShowFirstTab: function() {
			if (this.options.show_initial_tab) {
 				if (this.model.get('current_tab_id')) {
 					// DNR TODO this is causing tabs to render twice in some cases e.g. style tab of edit panel
 					// but without it, no tab is shown when closing and reopening the edit panel
 					// fixed by tracking 'shown' state on tab model. not perfect but will do for now
					this.showCurrentTab();
				} else {
					var first_tab = this.collection.first();
					if (first_tab) {
						this.setCurrentTabId(first_tab.get('id'), {replace: true});
					}
				}
			}
		},

		createNav: function() {
			_.defaults(this.options.nav, {
				view: ButtonBarView,
				viewOptions: {},
			});
			if (! this.options.nav.region) throw new Error('Tab nav requires a region');

			this.nav = new this.options.nav.view(_.extend(this.options.nav.viewOptions, {
				tabs: this,
			}));

			this.options.nav.region.show(this.nav);

		},

		setHistory: function(options) {
			if (! this.router) return;
			var tab_id = this.model.get('current_tab_id');
			this.router.navigate(tab_id, options);
		}


	});


	// define publicly accessible entities
	Tabs.ButtonBarView = ButtonBarView;
	Tabs.MenuView = MenuView;
	return Tabs;

});
