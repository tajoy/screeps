/**
 * Created by Jacky on 2015-09-04 17:31:39.
 *
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common'); // -> 'a thing'
 **/


var getEnergy = null;
var getCapacity = null;
var spawnCreep = null;
var isAllocId = null;
var allocSource = null;
var allocTransfer = null;
var allocBeTransfer = null;
var getBodyDesc = null;
var getErrDesc = null;


var utility = require("utility");
var log = require("log");


getEnergy = function (stct) {
    if (!stct || !stct.structureType) return;
    if (stct.structureType == STRUCTURE_EXTENSION
        || stct.structureType == STRUCTURE_SPAWN
        || stct.structureType == STRUCTURE_LINK) {
        return stct.energy;
    }
    if (stct.structureType == STRUCTURE_STORAGE) {
        return stct.store.energy;
    }
    return -1;
};
getCapacity = function (stct) {
    if (!stct || !stct.structureType) return;
    if (stct.structureType == STRUCTURE_EXTENSION
        || stct.structureType == STRUCTURE_SPAWN
        || stct.structureType == STRUCTURE_LINK) {
        return stct.energyCapacity;
    }
    if (stct.structureType == STRUCTURE_STORAGE) {
        return stct.storeCapacity;
    }
    return -1;
};

spawnCreep = function (_spawn, _body, _role, _name) {
    if (!utility.isObject(_spawn)
        || !utility.isArray(_body)
        || !utility.isString(_role)
    ) return;
    if (!arguments[3]) _name = null;

    if (_spawn.canCreateCreep(_body) != OK) {
        log("Cannot create creep[" + _role + "] right now !!!");
        return false;
    }
    var ret = _spawn.createCreep(
        _body,
        _name,
        {"role": _role}
    );
    var msg = "";
    if (utility.isString(ret)) {
        msg = "Spawn a " + _role + ": " + ret + " with body:\n\t" + getBodyDesc(_body)
        log(msg);
        return true;
    } else {
        msg = "Cannot create creep:\n\t" + getErrDesc(ret);
        log(msg);
        return false;
    }
};
isAllocId = function (section, id) {
    if (!utility.isString(section)) return false;
    if (!utility.isString(id)) return false;

    var creeps = Game.creeps;
    var isRepetition = false;
    for (var i = 0;
         i < creeps.length;
         i++
    ) {
        if (creeps[i].memory[section] == id) {
            isRepetition = true;
            break;
        }
    }
    return isRepetition;
};
allocSource = function (cp) {
    if (!cp || !cp.room || !cp.id) return;
    var sources = cp.room.find(FIND_SOURCES);
    var num = sources.length;
    if (num > 0) {
        var idx = parseInt("0x" + cp.id.substr(cp.id.length - 3, 2));
        log("_allocSource with idx:" + idx);
        cp.memory.sourceId = sources[idx % num].id;
        return cp.memory.sourceId;
    }
    return null;
};
allocTransfer = function (cp) {
    if (!cp || !cp.room || !cp.pos) return;
    var rm = cp.room;

    var targets = rm.find(FIND_MY_STRUCTURES, {
        filter: function (object) {
            return (!isAllocId("transferId", object.id) && (
                object.structureType == STRUCTURE_EXTENSION
                || object.structureType == STRUCTURE_STORAGE
                || object.structureType == STRUCTURE_LINK
            ));
        }
    });
    var sps = rm.find(FIND_MY_SPAWNS, {
        filter: function (object) {
            return !isAllocId("transferId", object.id);
        }
    });
    if (sps && utility.isArray(sps) && sps.length > 0) {
        targets = targets.concat(sps);
    } else {
        targets.push(sps);
    }
    /*
    //计算所有路径
    for (var index in targets) {
        targets[index].path = cp.pos.findPathTo(targets[index]);
    }
    //按距离升序排序
    targets.sort(function (a, b) {
        return a.path.length > b.path.length ? 1 : -1;
    });
    */

    for (var i = 0; i < Memory.config.transfer_pos.length; i++) {
        var type = Memory.config.transfer_pos[i];
        for (var j = 0; j < targets.length; j++) {
            var target = targets[j];
            if (target.structureType == STRUCTURE_STORAGE
                && target.store.energy > Memory.config.transfer_storage_high
            ) {
                continue;
            }
            if (target.structureType == type
                && getEnergy(target) < getCapacity(target)) {
                cp.memory.transferId = target.id;
                return;
            }
        }
    }

};

allocBeTransfer = function (cp) {
    if (!cp || !cp.room || !cp.pos) return;
    var rm = cp.room;

    var targets = rm.find(FIND_MY_STRUCTURES, {
        filter: function (object) {
            return (!isAllocId("transferId", object.id) && (
                object.structureType == STRUCTURE_EXTENSION
                || object.structureType == STRUCTURE_STORAGE
                || object.structureType == STRUCTURE_LINK
            ));
        }
    });
    var sps = rm.find(FIND_MY_SPAWNS, {
        filter: function (object) {
            return !isAllocId("transferId", object.id);
        }
    });
    if (sps && utility.isArray(sps) && sps.length > 0) {
        targets = targets.concat(sps);
    } else {
        targets.push(sps);
    }
    /*
    //计算所有路径
    for (var index in targets) {
        targets[index].path = cp.pos.findPathTo(targets[index]);
    }
    //按距离升序排序
    targets.sort(function (a, b) {
        return a.path.length > b.path.length ? 1 : -1;
    });
    */

    for (var i = 0; i < Memory.config.be_transfer_pos.length; i++) {
        var type = Memory.config.be_transfer_pos[i];
        for (var j = 0; j < targets.length; j++) {
            var target = targets[j];
            if (target.structureType == STRUCTURE_STORAGE) {
                if (target.store.energy < Memory.config.transfer_storage_low) {
                    continue;
                } else {
                    cp.memory.beTransferId = target.id;
                    return;
                }
            }
            if (target.structureType == type
                && getEnergy(target) > 0
            ) {
                cp.memory.beTransferId = target.id;
                return;
            }
        }
    }
};

getBodyDesc = function (body) {
    if (!utility.isArray(body)) return "";

    var ret = "[";
    for (var i = 0; i < body.length; i++) {
        switch (body[i]) {
            case MOVE:
                ret += "MOVE, ";
                break;
            case WORK:
                ret += "WORK, ";
                break;
            case CARRY:
                ret += "CARRY, ";
                break;
            case ATTACK:
                ret += "ATTACK, ";
                break;
            case RANGED_ATTACK:
                ret += "RANGED_ATTACK, ";
                break;
            case HEAL:
                ret += "HEAL, ";
                break;
            case TOUGH:
                ret += "TOUGH, ";
                break;
            default :
                break;
        }
    }
    ret += "]";

    return ret;
};


getErrDesc = function (errcode) {
    if (!utility.isNumber(errcode)) return "";

    switch (errcode) {
        case OK:
            return "OK" + "\n\t"
                + "Succeed!";
        case ERR_NOT_OWNER:
            return "ERR_NOT_OWNER" + "\n\t"
                + "You are not the owner of this object.";
        case ERR_NO_PATH:
            return "ERR_NO_PATH" + "\n\t"
                + "There is no path.";
        case ERR_NAME_EXISTS:
            return "ERR_NAME_EXISTS" + "\n\t"
                + "The name is exists.";
        case ERR_BUSY:
            return "ERR_BUSY" + "\n\t"
                + "The object is still being busy.";
        case ERR_NOT_FOUND:
            return "ERR_NOT_FOUND" + "\n\t"
                + "Not found.";
        case ERR_NOT_ENOUGH_ENERGY:
            return "ERR_NOT_ENOUGH_ENERGY" + "\n\t"
                + "It's needs energy is not enough.";
        case ERR_INVALID_TARGET:
            return "ERR_INVALID_TARGET" + "\n\t"
                + "The target is not a valid object.";
        case ERR_FULL:
            return "ERR_FULL" + "\n\t"
                + "This object is full.";
        case ERR_NOT_IN_RANGE:
            return "ERR_NOT_IN_RANGE" + "\n\t"
                + "The target is too far away.";
        case ERR_INVALID_ARGS:
            return "ERR_INVALID_ARGS" + "\n\t"
                + "The arguments is invalid.";
        case ERR_TIRED:
            return "ERR_TIRED" + "\n\t"
                + "The creep is tired.";
        case ERR_NO_BODYPART:
            return "ERR_NO_BODYPART" + "\n\t"
                + "There are no [WORK] body parts in this creep’s body.";
        case ERR_NOT_ENOUGH_EXTENSIONS:
            return "ERR_NOT_ENOUGH_EXTENSIONS" + "\n\t"
                + "Extensions is not enough.";
        case ERR_RCL_NOT_ENOUGH:
            return "ERR_RCL_NOT_ENOUGH" + "\n\t"
                + "Room Controller Level is not enough.";
        case ERR_GCL_NOT_ENOUGH:
            return "ERR_GCL_NOT_ENOUGH" + "\n\t"
                + "Global Controller Level is not enough.";
        default :
            return "";
    }
};

module.exports = {
    "getEnergy": getEnergy,
    "getCapacity": getCapacity,
    "spawnCreep": spawnCreep,
    "isAllocId": isAllocId,
    "allocSource": allocSource,
    "allocTransfer": allocTransfer,
    "allocBeTransfer": allocBeTransfer,
    "getBodyDesc": getBodyDesc,
    "getErrDesc": getErrDesc
};