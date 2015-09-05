/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('init_memory_and_config'); // -> 'a thing'
**/

module.exports = function () {
    if(!Memory.cache) Memory.cache = {};
    if(!Memory.cache.path)  Memory.cache.path = {};

    if(!Memory.status) Memory.status = {};
    if(!Memory.status.creeps) Memory.status.creeps = {};

    if(!Memory.config) Memory.config = {};
    if(!Memory.config.spawn) Memory.config.spawn = {};


    if(!Memory.config.is_up_controller_by_room) Memory.config.is_up_controller_by_room = {};

    require("config_common")();
    require("config_limits")();
    require("config_spawn")();
};