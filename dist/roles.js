/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roles'); // -> 'a thing'
 **/


var utility = require('utility');
var common = require('common');

var roles_state_mahcine = {};

for (var i in Memory.config.roles) {
    roles_state_mahcine[Memory.config.roles[i]]
        = require("role_" + Memory.config.roles[i]);
}

var _spawn = function (_role, _spawn, _name) {
    if (!_spawn)return;
    if (!utility.isString(_role)) return;
    if (!arguments[2]) _name = null;
    var body = null;
    var body_list = Memory.config.spawn[_role];
    if (!body_list) return;


    for (var i = 0; i < body_list.length; i++) {
        if (_spawn.canCreateCreep(body_list[i], _name) == OK) {
            body = body_list[i];
            break;
        }
    }

    if (body) {
        var cp_name = common.spawnCreep(_spawn, body, _role, _name);
        return utility.isString(cp_name);
    } else {
        return false;
    }
};


var _action = function (cp) {
    if (!utility.isObject(cp)) return;
    if (!cp || !cp.room) return;
    if (!cp.memory.role) return;

    var state_mahcine = roles_state_mahcine[cp.memory.role];
    if (!state_mahcine) return;
    var func = null;

    if (cp.memory.state) {
        if (utility.isUndefined(cp.ticksToLive) || cp.ticksToLive > 1) {
            func = state_mahcine[cp.memory.state];
        } else {
            func = state_mahcine["deinit"];
            cp.suicide();
        }
    } else {
        func = state_mahcine["init"];
    }
    if (utility.isFunction(func)) {
        func(cp);
    }
};


module.exports = {
    spawn: _spawn,
    action: _action
};




