define(function(require) {
	'use strict';

	/* MODULE DEPENDENCIES */
	var
	Backbone		= require('backbone'),
	Marionette		= require('marionette'),
	Log				= require('log');

	Log.module('lib/router');
	var log = Log.create('router');


	// override Backbone.History.prototype.route
	// to allow for handlers to have a router associated with them
	// this allows us to remove routes dynamically e.g. in router.destroy (see below)
	Backbone.History.prototype.route = function(route, callback, router) {
    	this.handlers.unshift({router: router, route: route, callback: callback});
	};


	var Router = Marionette.AppRouter.extend({

		initialize: function(options) {
			Marionette.AppRouter.prototype.initialize.apply(this, arguments);

			_.bindAll(this, 'checkState');
			if (Backbone.History.started) {
				// if this router was initialized after history started,
				// it might have added a route that need to be triggered
				// initialize is called first in the Marionette.AppRouter constructor, before appRoutes have been processed
				// have to defer checkState so that rest of constructor can complete first
				_.defer(this.checkState);
			} else {
				log('Backbone.history not started yet');
				// DNR TODO why not just start history here?
				// this could obviate the need for the `router:done` event
				// would require that we use this router everywhere, or at least in the app itself
				// but `router:done` isn't scalable, since modules can't be sure their router is first
				// so yeah we should do this so modules can make routers whenever they want
			}
		},

		checkState: function() {
			// make sure Backbone.history exists; not needed but just to be safe
			if (! Backbone.history) Backbone.history = new Backbone.History();

			// this tells Backbone.history to check the current fragment for any matching routes
			// need to audit this when upgrading Backbone `upgrade:backbone:audit`
			Backbone.history.loadUrl();
		},

		// override Backbone.Router.route method
		// the only difference is that we pass a reference to `this` to Backbone.history.route
		// so this router's routes can be removed onDestroy
		// need to audit this when upgrading Backbone `upgrade:backbone:audit`
		route: function(route, name, callback) {
			if (!_.isRegExp(route)) route = this._routeToRegExp(route);
			if (_.isFunction(name)) {
				callback = name;
				name = '';
			}
			if (!callback) callback = this[name];
			var router = this;
			Backbone.history.route(route, function(fragment) {
				var args = router._extractParameters(route, fragment);
				router.execute(callback, args);
				router.trigger.apply(router, ['route:' + name].concat(args));
				router.trigger('route', name, args);
				Backbone.history.trigger('route', router, name, args);
			}, this);
			return this;
		},

		// override Marionette.AppRouter.prototype._addAppRoute
		// to prepend `scope` to all routes
		// need to audit this when upgrading Marionette `upgrade:marionette:audit`
		_addAppRoute: function(controller, route, methodName) {
			if (this.options.scope) {
				route = this.options.scope + '/' + route;
			}
			Marionette.AppRouter.prototype._addAppRoute.apply(this, [controller, route, methodName]);
		},

		// override Marionette.AppRouter.prototype.navigate
		// to prevent out-of-scope URL changes, and other automated niceties
		// need to audit this when upgrading Marionette `upgrade:marionette:audit`
		navigate: function(fragment, options) {
			/* jshint maxcomplexity: 11 */
			options = options || {};

			var current_fragment = Backbone.history.fragment,
				scope = this.options.scope,
				defaults = {},
				re;

			/* jshint maxdepth: 4 */
			if (scope) {
				if (fragment) {
					// prepend scope to fragment
					fragment = scope + '/' + fragment;

					// if current URL ends in scope, this is additive, so set replace: true
					// we only do this if options.replace isn't already set to false (using _.defaults below)
					re = new RegExp(scope+'/?$', 'i');
					if (current_fragment.match(re)) {
						defaults.replace = true;
					}

				} else {
					// fragment is empty, use scope as fragment
					// this allows you to pass an empty string to reset URL to scope
					fragment = scope;
				}

				// validate that requested URL is in scope
				// use `force: true` to override this scope check
				re = new RegExp(scope, 'i');
				if (! current_fragment.match(re)) {
					if (! options.force) {
						log.error('Tab URL is out of scope.', scope, current_fragment);
						return;
					}
				}
			}

			// if URL already exists in fragment, don't overwrite URL
			// use `force: true` to force overwrite
			re = new RegExp(fragment);
			if (current_fragment.match(re)) {
				// log('URL is already in place, no need to write');
				if (! options.force) return;
			}

			// if URL is the same, but case is different, just replace the history state
			// e.g. navigate to /mixedcase/collections, URL will be updated to /MixedCase/collections
			// but it won't add an additional state to the history, so back button still works
			re = new RegExp(fragment+'/?$', 'i');
			if (current_fragment.match(re)) {
				defaults.replace = true;
			}

			// apply our defaults to the passed options
			// e.g. if replace is explicitly set to false, then we can't override it
			_.defaults(options, defaults);

			return Marionette.AppRouter.prototype.navigate.apply(this, [fragment, options]);
		},

		// custom destroy method
		// removes any handlers that belong to this router
		destroy: function() {
			log('destroy router for scope', this.options.scope);
			log('Backbone.history.handlers.length', Backbone.history.handlers.length);
			Backbone.history.handlers = _.filter(Backbone.history.handlers, function(handler) {
				return (handler.router !== this);
			}, this);
			log('Backbone.history.handlers.length', Backbone.history.handlers.length);
		}

	});

	return Router;

});
