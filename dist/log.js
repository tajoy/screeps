/**
 * Created by Jacky on 2015-09-05 04:00:03.
 *
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('log'); // -> 'a thing'
 **/

require('init_memory_and_config')();
if (Memory.config.isDebug) {
    module.exports = function () {
    };
} else {
    module.exports = console.log;
}
