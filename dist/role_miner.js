/**
 * Created by Jacky on 2015-09-04 17:45:53.
 *
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role_miner'); // -> 'a thing'
 **/

var utility = require("utility");
var common = require("common");

/**
 * @description: 该角色负责: 挖矿, 与gleaner配合传输能量至储存的地方
**/
module.exports = {
    init: function (cp) {
        cp.memory.state = "mine";
    },
    deinit: function (cp) {
        if (Memory.creeps[cp.name]) delete Memory.creeps[cp.name];
    },
    mine: function (cp) {

        if (!cp.memory.sourceId) {
            common.allocSource(cp);
        }
        var source = Game.getObjectById(cp.memory.sourceId);
        if (!source) {
            cp.memory.sourceId = null;
            return;
        }

        if (!cp.pos.isNearTo(source.pos)) {
            cp.moveTo(source);
        } else {
            cp.harvest(source);
        }
        //如果满了就放地上
        if (cp.carry.energy == cp.carryCapacity) {
            cp.dropEnergy();
        }
    },
    drop: function (cp) {
        cp.dropEnergy();
        cp.memory.state = "mine";
    },
    trans: function (cp) {
        var target_creep = Game.getObjectById(cp.memory.creepId);
        //找不到
        // 或 目标creep满载
        // 或 自己没有能量
        // 或 目标不在附近
        // 就 继续挖矿
        if (!target_creep
            || target_creep.carry.energy == target_creep.carryCapacity
            || cp.carry.energy == 0
            || !target_creep.pos.isNearTo(cp.pos)
        ) {
            cp.memory.state = "mine";
            return;
        }
        cp.transferEnergy(target_creep);
        cp.memory.state = "mine";
    }

};