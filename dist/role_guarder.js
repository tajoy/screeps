/**
 * Created by Jacky on 2015-09-04 17:41:31.
 *
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role_guarder'); // -> 'a thing'
 **/

var utility = require("utility");
var common = require("common");

/**
 * @description: 该角色负责:
**/
module.exports = {
    init: function (cp) {
        cp.memory.state = "defend";
    },
    deinit: function (cp) {
        if (Memory.creeps[cp.name]) delete Memory.creeps[cp.name];
    },
    defend: function (cp) {
        var targets = cp.room.find(FIND_HOSTILE_CREEPS);
        var target = utility.randomSelectArray(targets);
        if (target) {
            //cp.say("defending ...");
            if (!cp.isNearTo(target)) {
                cp.moveTo(energy);
            } else {
                cp.attack(target);
            }
        }
    }

};