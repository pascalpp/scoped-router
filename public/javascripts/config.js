requirejs.config({
  baseUrl: '/javascripts',
  paths: {
    'jquery': 'vendor/jquery',
    'backbone': 'vendor/backbone',
    'marionette': 'vendor/backbone.marionette',
    'backbone.radio': 'vendor/backbone.radio',
    'underscore': 'vendor/underscore',
    'text': 'vendor/text'
  },

  shim: {
    underscore: {
      exports: '_'
    }
  }
});

define(function(require) {
  'use strict';

  require('main');
});