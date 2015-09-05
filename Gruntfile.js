var fs = require('fs');
var config = {
    account: "",
    password: "",
    branch: ""
}

function readSyn() {
    process.stdin.pause();
    var response = fs.readSync(process.stdin.fd, 1000, 0, "utf8");
    process.stdin.resume();
    return response[0].trim();
}

function getter(section) {
    return function () {
        if (config[section] != "") {
            console.log(section + " : " + config[section]);
            return config[section];
        }
        var data = null;
        if (fs.existsSync('config.json')) {
            data = fs.readFileSync('config.json', 'utf-8');
            config = JSON.parse(data);
        }
        if (config[section] == "") {
            console.log("enter " + section + " : ");
            config[section] = readSyn();
            data = JSON.stringify(config);
            fs.writeFileSync('config.json', data);
        }
        console.log(section + " : " + config[section]);
        return config[section];
    };
}
var getAccount = getter("account");
var getPassword = getter("password");
var getBranch = getter("branch");


module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: getAccount(),
                password: getPassword(),
                branch: getBranch()
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });
    console.log("Enter anything to confirm!");
    readSyn();
}