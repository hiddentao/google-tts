'use strict';

module.exports = function (grunt) {
  var srcFolder = __dirname + '/src';

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

    uglify: {
      dist: {
        files: {
          'google-tts.min.js': [srcFolder + '/google-tts.js']
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', 'Build project', ['jshint', 'uglify']);

  grunt.registerTask('default', ['build']);
};
