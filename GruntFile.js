module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: './deploy'
                }
            }
        },
        // `grunt copy` syncs assets.
        copy: {
            dist: {
                expand: true,
                cwd: 'src/assets',                
                src: '**',
                dest: 'deploy/assets/',
            }
        },
        // `grunt clean` is equivalent to `rm -rf pub`.        
        clean: ['deploy/assets/**'],
        concat: {
            dist: {
                src: [  "src/lib/**/*.js",
                    "src/game/**/*.js"
                     ],
                dest: 'deploy/js/<%= pkg.name %>.js'
            }
        },
        watch: {
            files: 'src/**/*.js',
            tasks: ['concat']
        },
        open: {
            dev: {
                path: 'http://localhost:8080/index.html'
            }
        }
    });

    grunt.registerTask('default', ['clean', 'copy', 'concat', 'connect', 'open', 'watch']);

}