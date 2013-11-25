module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'src/*.js',
      ]
    },
    concat: {
        dist: {
          src: 'src/*.js',
          dest: 'dist/olly.js',
        }
    },
    uglify: {
      dist: {
        src: "dist/olly.js",
        dest: "dist/olly.min.js"
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', [
    'jshint',
    'concat',
    'uglify'
  ]);
};