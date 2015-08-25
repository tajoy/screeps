var fs = require('fs');  
var account = 'tajoy@foxmail.com';
function readSyn() {  
   process.stdin.pause();
   console.log("account : " + account);
   console.log("enter password: ");
   var response = fs.readSync(process.stdin.fd, 1000, 0, "utf8");  
   process.stdin.resume();  
   return response[0].trim();
}

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: account ,
                password: readSyn(),
                branch: 'default'
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });
}