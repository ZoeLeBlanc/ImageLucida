module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-sass');

  grunt.initConfig({
    jshint: {
      files: ['/image_lucida_app/static/javascripts/**/*.js'],
      options: {
        predef: [ "document", "console", "$", "app", "angular"],
        esnext: true,
        globalstrict: true,
        globals: {}
      }
    },
     sass: {
      dist: {
        files: {
          '/image_lucida_app/static/css/main.css': '/image_lucida_app/static/sass/styles.scss'
        }
      }
    },
    watch: {
      javascripts: {
        files: ['image_lucida_app/static/javascripts/**/*.js'],
        tasks: ['jshint']
      },
      sassy: {
        files: ['image_lucida_app/static/sass/**/*.scss'],
        tasks: ['sass']        
      }
    }
  });
  
  grunt.registerTask('default', ['sass', 'jshint', 'watch']);
  grunt.registerTask('lint', ['jshint']);
};