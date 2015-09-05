/**
 * Created by Jacky on 2015-09-04 17:42:56.
 *
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role_transporter'); // -> 'a thing'
 **/


var utility = require("utility");
var common = require("common");

function getOtherIds(cp, section) {
    if (!utility.isString(section)) return;
    var targets = cp.room.find(FIND_MY_STRUCTURES, {
        filter: function (object) {
            return (!common.isAllocId(section, object.id) && (
                object.structureType == STRUCTURE_EXTENSION
            ));
        }
    });
    var sps = cp.room.find(FIND_MY_SPAWNS, {
        filter: function (object) {
            return !common.isAllocId(section, object.id);
        }
    });
    if (sps && utility.isArray(sps) && sps.length > 0) {
        targets = targets.concat(sps);
    } else {
        targets.push(sps);
    }
    for (var j = 0; j < targets.length; j++) {
        var target = targets[j];
        if (common.getEnergy(target) < common.getCapacity(target)) {
            cp.memory[section] = target.id;
            return;
        }
    }

}



/**
 * @description: 该角色负责: 在各储存能量的建筑之间周转能量
 **/
module.exports = {
    init: function (cp) {
        cp.memory.state = "look";
    },
    deinit: function (cp) {
        if (Memory.creeps[cp.name]) delete Memory.creeps[cp.name];
    },
    //看看该干什么
    look: function (cp) {
        //如果没有 storage, 就变成成 gleaner
        if (!cp.room.storage) {
            cp.memory.role = "gleaner";
        }
        if (!Memory.status.isFull) {
            //1.工作人员不足, 从storage取资源
            cp.memory.beTransferId = cp.room.storage.id;
            getOtherIds(cp, "transferId");
        } else {
            //2.工作人员充足, 从其他地方储存资源到storage
            getOtherIds(cp, "beTransferId");
            cp.memory.transferId = cp.room.storage.id;
        }
        cp.memory.state = "beTransfer";
    },
    //获取资源
    beTransfer: function (cp) {
        if (cp.carry.energy == cp.carryCapacity) {
            cp.memory.state = "transfer";
            cp.memory.beTransferId = null;
            return;
        }
        var target = Game.getObjectById(cp.memory.beTransferId);
        if (!target || !cp.memory.beTransferId) {
            cp.memory.state = "look";
            cp.memory.beTransferId = null;
            return;
        }

        if (target
            && common.getEnergy(target) > 0
            && utility.isFunction(target.transferEnergy)
        ) {
            if (!cp.pos.isNearTo(target.pos)) {
                cp.moveTo(target);
            } else {
                target.transferEnergy(cp);
            }
        } else {
            cp.memory.state = "look";
            cp.memory.beTransferId = null;
        }

    },
    //存放资源
    transfer: function (cp) {
        if (cp.carry.energy == 0) {
            cp.memory.state = "look";
            cp.memory.transferId = null;
            return;
        }

        var transfer = Game.getObjectById(cp.memory.transferId);
        if (!transfer || transfer == null || !cp.memory.transferId) {
            cp.memory.state = "look";
            cp.memory.transferId = null;
        }
        var now = common.getEnergy(transfer);
        var cap = common.getCapacity(transfer);
        if (now + cp.carry.energy > cap) {
            if (now == cap) {
                cp.memory.state = "look";
                cp.memory.transferId = null;
            } else {
                if (!transfer || transfer == null || !cp.memory.transferId) {
                    cp.memory.state = "look";
                    cp.memory.transferId = null;
                }
                if (!cp.pos.isNearTo(transfer.pos)) {
                    cp.moveTo(transfer);
                } else {
                    cp.transferEnergy(transfer, now + cp.carry - cap);
                }
            }
        } else {
            if (!transfer || transfer == null || !cp.memory.transferId) {
                cp.memory.state = "look";
                cp.memory.transferId = null;
            }
            if (!cp.pos.isNearTo(transfer.pos)) {
                cp.moveTo(transfer);
            } else {
                cp.transferEnergy(transfer);
            }
        }

    }

}
;