module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            source: {
                expand: true,
                flatten: true,
                src: ['js/jquery.slidorion.js'],
                dest: 'dist/'
            }
        },

        uglify: {
            options: {
                mangle: false,
                report: 'gzip',
                preserveComments: 'some'
            },
            my_target: {
                files: {
                    'dist/jquery.slidorion.min.js': 'js/jquery.slidorion.js'
                }
            }
        },

        watch: {
            files: ['js/*.js'],
            tasks: ['dist']
        }
    });

    // Load plugin(s)
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['dist', 'watch']);
    grunt.registerTask('dist', ['uglify', 'copy:source']);

};