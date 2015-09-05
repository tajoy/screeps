/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role_keep'); // -> 'a thing'
 */
var utility = require('utility');
var roles = require('roles');
var log = require("log");

module.exports = function () {
    var limits = Memory.config.creeps_limits;

    //统计各个房间内的creep各种角色数目
    var rooms_count = {};


    log("role_keep doing ...");

    //初始化计数器
    for (var rmName in limits) {
        if (!Game.rooms[rmName]) continue;
        rooms_count[rmName] = {};
        for (var i in limits[rmName]) {
            var role = limits[rmName][i].role;
            rooms_count[rmName][role] = 0;
        }
    }

    //统计各个房间工种的数量
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        var rmName = creep.room.name;
        if (!Game.rooms[rmName]) continue;
        var role = creep.memory.role;
        if (rooms_count[rmName] == null) {
            rooms_count[rmName] = {};
        }
        if (rooms_count[rmName][role] != null) {
            rooms_count[rmName][role] += 1;
        }
    }

    //保存统计数据
    Memory.status.creeps.count = rooms_count;


    //打印统计
    for (var rmName in rooms_count) {
        var count = rooms_count[rmName];
        if (!Game.rooms[rmName]) continue;
        log(
            "All available energy in room[" + rmName + "]:\n\t"
            + Game.rooms[rmName].energyAvailable
            + "/"
            + Game.rooms[rmName].energyCapacityAvailable
        );
        if (Game.rooms[rmName].storage) {
            log(
                "Storage energy in room[" + rmName + "]:\n\t"
                + Game.rooms[rmName].storage.store.energy
                + "/"
                + Game.rooms[rmName].storage.storeCapacity
            );
        }
        var roles_count = "";
        for (var i in limits[rmName]) {
            var role = limits[rmName][i].role;
            roles_count += "\t" + role + " = "
                + count[role] + "/" + limits[rmName][i].limit + "\n";
        }
        log("creep count in room[" + rmName + "]:\n" + roles_count);
    }

    //是否满员
    Memory.status.isFull = true;

    //遍历所有房间
    for (var rmName in rooms_count) {
        var count = rooms_count[rmName];
        if (!Game.rooms[rmName]) continue;

        var _spawns = Game.rooms[rmName].find(FIND_MY_SPAWNS);

        var rcl = Game.rooms[rmName].controller;
        // 没有一个builder 并且 低于警告值, 强制生产builder
        if (count["builder"] <= 0
            && rcl.ticksToDowngrade < Memory.config.warning_ticks_downgrade_low
        ) {
            if (_spawns.length > 0) {
                roles.spawn("builder", utility.randomSelectArray(_spawns));
                return;
            }
        }

        //检测各角色限制
        for (var i = 0; i < limits[rmName].length; i++) {
            var limit = limits[rmName][i];
            var role = limit.role;
            var num = limit.limit;
            if (count[role] == null) continue;
            if (!utility.isNumber(count[role])) continue;
            //低于限制, 产生相应角色
            if (count[role] < num) {
                if (_spawns.length > 0) {
                    roles.spawn(role, utility.randomSelectArray(_spawns));
                    Memory.status.isFull = false;
                    return;
                }
            }
        }
    }


};




