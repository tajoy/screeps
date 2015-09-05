/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('cmd'); // -> 'a thing'
 **/
module.exports = {
    pause: function () {
        Memory.config.isPause = true;
    },
    resume: function () {
        Memory.config.isPause = false;
    },
    reset_config: function () {
        delete Memory.config;
    },
    clean_memory: function () {
        delete Memory.creeps;
        delete Memory.config;
        delete Memory.cache;
        delete Memory.status;
    },
    kill_all_creeps: function () {
        for (var name in Game.creeps) {
            Game.creeps[name].suicide();
        }
    }
};