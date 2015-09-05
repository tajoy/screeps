/**
 * Created by Jacky on 2015-09-04 17:40:16.
 *
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role_worker'); // -> 'a thing'
 **/
var utility = require("utility");
var common = require("common");

/**
 * @description: 该角色负责: 挖矿和运输能量至储存地
 **/
module.exports = {
    init: function (cp) {
        cp.memory.state = "mine";
        common.allocSource(cp);
    },
    deinit: function (cp) {
        if (Memory.creeps[cp.name]) delete Memory.creeps[cp.name];
    },
    //采集能量(挖矿)
    mine: function (cp) {
        //能量收集满了, 运输回去
        if (cp.carry.energy == cp.carryCapacity) {
            cp.memory.state = "trans";
            return;
        }

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

        if (cp.memory.transferId) cp.memory.transferId = null;
    },
    //运输能量回去储存
    trans: function (cp) {
        //能量放好了, 该去挖矿了
        if (cp.carry.energy == 0) {
            cp.memory.state = "mine";
            return;
        }

        var transfer = Game.getObjectById(cp.memory.transferId);
        if (!cp.memory.transferId || !transfer) {
            common.allocTransfer(cp);
        }
        var now = common.getEnergy(transfer);
        var cap = common.getCapacity(transfer);
        if (now + cp.carry.energy > cap) {
            if (now == cap) {
                common.allocTransfer(cp);
            } else {
                if (!cp.pos.isNearTo(transfer.pos)) {
                    cp.moveTo(transfer);
                } else {
                    cp.transferEnergy(transfer, now + cp.carry - cap);
                }
            }
        } else {
            if (!cp.pos.isNearTo(transfer.pos)) {
                cp.moveTo(transfer);
            } else {
                cp.transferEnergy(transfer);
            }
        }
    }

};