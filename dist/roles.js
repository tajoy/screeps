/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roles'); // -> 'a thing'
**/


var utility = require('utility');


var _getEnergy = function(stct){
    if (stct.structureType == STRUCTURE_EXTENSION
        || stct.structureType == STRUCTURE_SPAWN
        || stct.structureType == STRUCTURE_LINK) {
        return stct.energy;
    }
    if (stct.structureType == STRUCTURE_STORAGE) {
        return stct.store.energy;
    }
    return -1;
}

var _getCapacity = function(stct){
    if (stct.structureType == STRUCTURE_EXTENSION
        || stct.structureType == STRUCTURE_SPAWN
        || stct.structureType == STRUCTURE_LINK) {
        return stct.energyCapacity;
    }
    if (stct.structureType == STRUCTURE_STORAGE) {
        return stct.storeCapacity;
    }
    return -1;
}

var _createCreep = function(_sp, body, _role, name){
    if(!arguments[1]) name = null;
    
    if(_sp.canCreateCreep(body) != OK){
        console.log("Cannot create creep["+_role+"] right now !!!");
        return null;
    }
    var cp =_sp.createCreep(
                body,
                name,
                { role : _role}
            );
    console.log("Spawn a "+_role+": " + cp);
    return cp;
}

var _allocSource = function(cp){
    var sources = cp.room.find(FIND_SOURCES);
    var num = sources.length;
    if(num > 0){
        var idx = parseInt("0x"+cp.id.substr(cp.id.length - 3, 2));
        console.log("_allocSource with idx:"+idx);
        cp.memory.sourceId = sources[idx%num].id;
        return cp.memory.sourceId;
    }
    return null;
}

var _allocEnergy = function(cp){
    var rm = cp.room;
    var pos = cp.pos;

    var targets = rm.find(FIND_MY_STRUCTURES, {
        filter: function(object) {
            return (
                object.structureType == STRUCTURE_EXTENSION
                || object.structureType == STRUCTURE_STORAGE
                || object.structureType == STRUCTURE_LINK
            );
        }
    });
    var sps = rm.find(FIND_MY_SPAWNS);
    if(utility.isArray(sps)){
        targets = targets.concat(sps);
    }else{
        targets.push(sps);
    }
    
    //计算所有路径
    for (var i in targets) {
        targets[i].path = cp.pos.findPathTo(targets[i]);
    }
    //按距离升序排序
    targets.sort(function(a,b){
        return a.path.length > b.path.length ? 1 : -1;
    });

    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];

        cp.memory.transferId = target.id;

        if (target.structureType == STRUCTURE_SPAWN
            && target.energy < target.storeCapacity) {
            return;
        }

        if (target.structureType == STRUCTURE_EXTENSION
            && target.energy < target.energyCapacity) {
            return;
        }

        if (target.structureType == STRUCTURE_STORAGE
            && target.store.energy < target.energyCapacity) {
            return;
        }

        //cooldown(number): The amount of game ticks the link has to wait
        // until the next transfer is possible.
        if (target.structureType == STRUCTURE_LINK
            && target.cooldown <= 0 
            && target.energy < target.energyCapacity) {
            return;
        }

    }
}




module.exports = {
    worker : {
        spawn : function(sp,name){
            if(!arguments[1]) name = null;
            var body = [WORK, WORK, CARRY, MOVE]
            var role = "worker"
            var cp =_createCreep(sp, body, role, name);
            if(utility.isString(cp)){
                _allocSource(Game.creeps[cp]);
            }
        },
        action : function(cp){
            if(cp.carry.energy < cp.carryCapacity) {
                cp.say("mining..");
                if(!cp.memory.sourceId){
                    _allocSource(cp);
                }
                var source = Game.getObjectById(cp.memory.sourceId);
                cp.moveTo(source);
                cp.harvest(source);
                if(cp.memory.transferId) cp.memory.transferId = null;
            } else {
                cp.say("returning ...");
                if(!cp.memory.transferId || !Game.getObjectById(cp.memory.transferId)){
                    _allocEnergy(cp);
                }
                var transfer = Game.getObjectById(cp.memory.transferId);
                cp.moveTo(transfer);
                var now = _getEnergy(transfer);
                var cap = _getCapacity(transfer);
                if ( now + cp.carry.energy > cap){
                    if(now == cap){
                        _allocEnergy(cp);
                    } else {
                        cp.transferEnergy(transfer, now + cp.carry - cap);
                    }
                } else {
                    cp.transferEnergy(transfer);
                }
            }
            if(cp.ticksToLive <= 0){
                delete Memory.creeps[cp.name];
            }
        },
    },
    builder : {
        spawn : function(sp,name){
            if(!arguments[1]) name = null;
            var body = [WORK, WORK, CARRY, MOVE]
            var role = "builder"
            _createCreep(sp, body, role, name);
        },
        action : function(cp){
            if(cp.carry.energy == 0) {
                if(Memory.status.creeps.count[cp.room]
                    && (Memory.status.creeps.count[cp.room]["worker"]
                    == Memory.config.creeps_limits[0][1])) return;
                var sps = rm.find(FIND_MY_SPAWNS);
                if( sps.length <=0 ) return;
                cp.say("get energy ...");
                cp.moveTo(sps[0]);
                sps[0].transferEnergy(cp);
            }
            else {
                var targets = cp.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    cp.say("Building ...");
                    cp.moveTo(targets[0]);
                    cp.build(targets[0]);
                }else{
                    //升级控制器
                    if(cp.room.controller) {
                        cp.say("Upgrading controller ...");
                        cp.moveTo(cp.room.controller);
                        cp.upgradeController(cp.room.controller);
                    }
                }
            }
        },
    },
    guarder : {
        spawn : function(sp,name){
            if(!arguments[1]) name = null;
            var body = [ATTACK, MOVE]
            var role = "guarder"
            _createCreep(sp, body, role, name);
        },
        action : function(cp){
            var targets = cp.room.find(FIND_HOSTILE_CREEPS);
            if(targets.length) {
                cp.say("defending ...");
                cp.moveTo(targets[0]);
                cp.attack(targets[0]);
            }
        },
    },
};





