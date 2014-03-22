'use strict';

module.exports = function (grunt) {
  var srcFolder = __dirname + '/src',
    testFodler = __dirname + '/test';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint:{
      options:{
        "bitwise":false,
        "camelcase":false,
        "curly":false,
        "eqeqeq":true,
        "forin":true,
        "immed":true,
        "indent":2,
        "latedef":false,
        "newcap":true,
        "noarg":true,
        "noempty":false,
        "nonew":true,
        "plusplus":false,
        "quotmark":false,
        "undef":true,
        "unused":false,
        "strict":true,
        "trailing":true,
        "expr": true,
        "boss":true,
        "laxcomma":true,
        "multistr":true,
        "sub":true,
        "supernew":true,

        "browser":true,
        "node":true,

        "predef":[
          'define', 'require', 'global', 'process'
        ]
      },
      files:[
        srcFolder
      ]
    },

    mochaTest:{
      test: {
        options:{
          reporter:'spec',
          ui:'exports'
        },
        src: [
          testFodler + '/*.test.js'
        ]
      }
    },

    uglify: {
      dist: {
        files: {
          'google-tts.min.js': [srcFolder + '/google-tts.js']
        }
      }
    },

    devserver: { 
      options: { 
        'port' : 8888,
        'base': '.'
      },
      server: {}
    }

  });


  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-devserver');

  grunt.registerTask('build', 'Build project', ['jshint', 'mochaTest', 'uglify']);

  grunt.registerTask('dev', 'Run dev server for local testing', ['devserver']);

  grunt.registerTask('default', ['build']);
};
