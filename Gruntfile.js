var path = require('path');
var unwrap = require('unwrap');
var modRewrite = require('connect-modrewrite');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          keepalive: true,
          livereload: true,
          port: 9000,
          hostname: '*',
        },
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        files: [{
          expand: true,
          src: [
            'src/**/*.js',
            'spec/**/*.js',
            'demo/**/*.js',
            // Exclude the following
            '!demo/js/highlight/**/*',
            '!spec/setup/node.js',
            '!spec/setup/require_helper.js',
          ]
        }]
      },
      src: {
        files: [{
          expand: true,
          src: [
            'src/**/*.js'
          ]
        }]
      },
      spec: {
        files: [{
          expand: true,
          src: [
            'spec/**/*.js',
            // Exclude the following
            '!spec/setup/node.js',
            '!spec/setup/require_helper.js',
          ]
        }]
      },
      demo: {
        files: [{
          expand: true,
          src: [
            'demo/**/*.js',
            // Exclude the following
            '!**/js/highlight/**/*',
          ]
        }]
      },
      changed: {
        src: ''
      }
    },

    watch: {
      js: {
        files: [
          'src/**/*.js',
          'spec/**/*.js',
          'demo/**/*.js',
          // Exclude the following
          '!foo/**/*',
        ],
        tasks: ['jshint:changed'],
        options: {
          spawn: false
        }
      },
    }

  });

  // define the js task
  grunt.registerTask('dev', ['watch:js']);

  grunt.registerTask('verify-bower', function () {
    if (!grunt.file.isDir('./bower_components')) {
      grunt.fail.warn('Missing bower components. You should run `bower install` before.');
    }
  });

  grunt.registerTask('test', 'Run the unit tests.', ['mochaTest']);

  // For the quick version of jshinting
  grunt.event.on('watch', function(action, filepath) {
    grunt.config('jshint.changed.src', filepath);
  });

};

//module.exports = function(grunt) {
//
//  grunt.initConfig({
//    pkg: grunt.file.readJSON('package.json'),
//
//    requirejs: {
//      build: {
//        options: {}
//      }
//    },
//    jshint: {
//      options: {
//        jshintrc: '.jshintrc',
//        reporter: require('jshint-stylish')
//      },
//      all: {
//        files: [{
//          expand: true,
//          src: [
//            'src/**/*.js',
//            // Exclude the following
//            '!foo/**/*',
//          ]
//        }]
//      },
//      changed: {
//        src: ''
//      }
//    },
//    watch: {
//      js: {
//        files: [
//          'src/**/*.js',
//          // Exclude the following
//          '!foo/**/*',
//        ],
//        tasks: ['jshint:changed'],
//        options: {
//          spawn: false
//        }
//      },
//    }
//  });
//
//  // define the js task
//  grunt.registerTask('js', ['watch:js']);
//
//  // we can add other tasks to this default task
//  // as we modify other parts of our build process
//  grunt.registerTask('default', ['js']);
//
//  // For the quick version of jshinting
//  grunt.event.on('watch', function(action, filepath) {
//    grunt.config('jshint.changed.src', filepath);
//  });
//
//};
