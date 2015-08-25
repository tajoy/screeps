var fs = require('fs');  
  
function readSyn() {  
   process.stdin.pause();  
   var response = fs.readSync(process.stdin.fd, 1000, 0, "utf8");  
   process.stdin.resume();  
   return response[0].trim();  
}

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'tajoy@foxmail.com',
                password: readSyn(),
                branch: 'default'
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });
}