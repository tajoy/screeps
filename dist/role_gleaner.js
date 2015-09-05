/**
 * Created by Jacky on 2015-09-04 17:45:29.
 *
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role_gleaner'); // -> 'a thing'
 **/

var utility = require("utility");
var common = require("common");

var _tellMinerTrans = function (cp, miner) {
    if (!cp) return false;
    if (!miner) return false;
    if (!cp.carry) return false;
    if (!miner.carry) return false;

    miner.memory.state = "trans";
    miner.memory.creepId = cp.id;

};


/**
 * @description: 该角色负责: 拾取地上的能量, 与miner配合收集其产出的能量至储存的地方
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
        //能量收集满了, 运输回去
        if (cp.carry.energy == cp.carryCapacity) {
            cp.memory.state = "trans";
            return;
        }

        var drops = cp.room.find(FIND_DROPPED_ENERGY, {
            filter: function (object) {
                return !common.isAllocId("dropId", object.id);
            }
        });
        if (drops && drops.length > 0) {
            cp.memory.dropId = utility.randomSelectArray(drops).id;
            cp.memory.state = "pickup";
            return;
        }


        var mines = cp.room.find(FIND_MY_CREEPS, {
            filter: function (object) {
                return cp.room.id == object.room.id
                    && object.memory.role == "miner"
                    && object.carry.energy > 0;
            }
        });
        if (mines && mines.length > 0) {
            cp.memory.minerId = utility.randomSelectArray(mines).id;
            cp.memory.state = "gather_miner";
            return;
        }

    },
    //运输能量回去储存
    trans: function (cp) {
        //能量放好了, 该去继续收集能量了
        if (cp.carry.energy == 0) {
            cp.memory.state = "look";
            return;
        }

        var transfer = Game.getObjectById(cp.memory.transferId);
        if (!transfer || transfer == null || !cp.memory.transferId ) {
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
    },
    //收集掉在地上的能量
    pickup: function (cp) {
        //能量收集满了, 运输回去
        if (cp.carry.energy == cp.carryCapacity) {
            cp.memory.state = "trans";
            return;
        }

        var drop = Game.getObjectById(cp.memory.dropId);
        if (drop) {
            if (!cp.pos.isNearTo(drop.pos)) {
                cp.moveTo(drop);
            } else {
                cp.pickup(drop);
            }
        } else {
            cp.memory.state = "look";
        }

    },
    //收集miner的能量
    gather_miner: function (cp) {
        //能量收集满了, 运输回去
        if (cp.carry.energy == cp.carryCapacity) {
            cp.memory.state = "trans";
            return;
        }

        var miner = Game.getObjectById(cp.memory.minerId);
        if (miner && miner.carry && miner.carry.energy > 0) {
            if (!cp.pos.isNearTo(miner)) {
                cp.moveTo(miner);
            } else {
                _tellMinerTrans(cp, miner);
            }
        } else {
            cp.memory.state = "look";
        }
    }
}
;