/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('prototypes'); // -> 'a thing'
**/
var roles = require('roles');
module.exports = function() {
    Spawn.prototype.createWorkerCreep = function(name) {
        return roles["worker"].spawn(name);
    };
    Spawn.prototype.createBuilderCreep = function(name) {
        return roles["builder"].spawn(name);
    };
    Spawn.prototype.createGuarderCreep = function(name) {
        return roles["guarder"].spawn(name);
    };
    Room.prototype.buildRoad = function(from, to) {
        if(from.roomName != to.roomName) return;
        var objs = from.pos.findPathTo(to);
        for (var i = objs.length - 1; i >= 0; i--) {
            var it = objs[i];
            return this.createConstructionSite(it.x, it.y, STRUCTURE_ROAD)
        };
    };
};