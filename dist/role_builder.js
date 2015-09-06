/**
 * Created by Jacky on 2015-09-04 17:40:55.
 *
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role_builder'); // -> 'a thing'
 **/
var utility = require("utility");
var common = require("common");


/**
 * @description: 该角色负责:修建/修复建筑物,升级房间控制器/防御工事
 **/
module.exports = {
    init: function (cp) {
        cp.memory.state = "look";
    },
    deinit: function (cp) {
        if (Memory.creeps[cp.name]) {
            delete Memory.creeps[cp.name];
        }
    },
    //看看该干什么
    look: function (cp) {

        var roles_count = Memory.status.creeps.count[cp.room.name];
        if (!roles_count) return;

        if (cp.carry.energy == 0) {
            cp.memory.state = "got_energy";
            return;
        }

        var priority = Memory.config.builder_priority;
        var rcl = cp.room.controller;
        //RCL(房间控制器)再不升级就会被降级了,所以强制调整其优先级
        if (rcl.ticksToDowngrade < Memory.config.warning_ticks_downgrade_low) {
            ["UPRCL",].concat(priority);
        }
        for (var i = 0; i < priority.length; i++) {
            switch (priority[i]) {
                case "BUILD"://修建建筑物
                    var sites = cp.room.find(FIND_CONSTRUCTION_SITES);
                    if (sites && sites.length > 0) {
                        var site = utility.randomSelectArray(sites);
                        if (site) {
                            cp.memory.state = "build_sites";
                            cp.memory.siteId = site.id;
                            return;
                        }
                    }
                    break;
                case "UPRCL"://升级RCL(房间控制器)
                    if (Memory.config.is_up_controller_by_room
                        && (
                            Memory.config.is_up_controller_by_room[cp.room.name] == true
                            ||
                            utility.isUndefined(Memory.config.is_up_controller_by_room[cp.room.name])
                        )
                    ) {
                        cp.memory.state = "up_controller";
                            return;
                    }
                    break;
                case "FIX"://修复建筑物
                    cp.memory.state = "fix_building";
                    return;
                case "UPDEF"://升级防御工事
                    cp.memory.state = "up_defense";
                    return;
            }
        }

    },
    //获取能量,以便工作
    got_energy: function (cp) {
        if (cp.carry.energy == cp.carryCapacity) {
            cp.memory.state = "look";
            cp.memory.beTransferId = null;
            return;
        }
        var target = Game.getObjectById(cp.memory.beTransferId);
        if (!target || !cp.memory.beTransferId) {
            common.allocBeTransfer(cp);
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
    //修建建筑物
    build_sites: function (cp) {
        if (cp.carry.energy == 0) {
            cp.memory.state = "got_energy";
            return;
        }

        if (!cp.memory.siteId) {
            cp.memory.state = "look";
            return;
        }
        var site = Game.getObjectById(cp.memory.siteId);

        //找不到site或者不是site就重新决定之后的工作
        if (!site || !utility.isNumber(site.progressTotal)) {
            cp.memory.state = "look";
            cp.memory.siteId = null;
            return;
        }
        if (!cp.pos.isNearTo(site.pos)) {
            cp.moveTo(site);
        } else {
            cp.build(site);
        }
    },
    //升级控制器
    up_controller: function (cp) {
        if (cp.carry.energy == 0) {
            cp.memory.state = "got_energy";
            return;
        }
        //升级控制器
        if (cp.room.controller) {
            if (!cp.pos.isNearTo(cp.room.controller.pos)) {
                //cp.say("Moving ...");
                cp.moveTo(cp.room.controller);
            } else {
                //cp.say("Up RCL ...");
                cp.upgradeController(cp.room.controller);
            }
        }
    },
    //修复建筑物
    fix_building: function (cp) {

        if (cp.carry.energy == 0) {
            cp.memory.state = "got_energy";
            return;
        }

        if (!cp.memory.fixId) {
            var fixes = cp.room.find(FIND_MY_STRUCTURES, {
                filter: function (it) {
                    return it.structureType != STRUCTURE_RAMPART
                        && (it.hits < it.hitsMax);
                }
            });
            if (!fixes || fixes.length <= 0) {
                cp.memory.state = "look";
                return;
            }
            cp.memory.fixId = utility.randomSelectArray(fixes).id;
        }
        var fix = Game.getObjectById(cp.memory.fixId);
        if (fix
            && fix.hits
            && fix.my
            && fix.structureType
            && fix.structureType == STRUCTURE_RAMPART
            && (fix.hits < fix.hitsMax)
        ) {
            if (!cp.pos.isNearTo(fix.pos)) {
                cp.moveTo(fix);
            } else {
                cp.repair(fix);
            }
        } else {
            //找不到需要修复的建筑物就重新决定之后的工作
            cp.memory.state = "look";
            cp.memory.fixId = null;
        }
    },
    //升级防御工事
    up_defense: function (cp) {
        if (cp.carry.energy == 0) {
            cp.memory.state = "got_energy";
            return;
        }

        if (!cp.memory.defenseId) {
            var defenses = cp.room.find(FIND_MY_STRUCTURES, {
                filter: function (it) {
                    return it.structureType == STRUCTURE_RAMPART
                        && (it.hits < it.hitsMax);
                }
            });
            if (!defenses || defenses.length <= 0) {
                cp.memory.state = "look";
                return;
            }
            cp.memory.defenseId = utility.randomSelectArray(defenses).id;
        }
        var defense = Game.getObjectById(cp.memory.defenseId);
        if (defense
            && defense.hits
            && defense.my
            && defense.structureType == STRUCTURE_RAMPART
            && (defense.hits < defense.hitsMax)
        ) {
            if (!cp.pos.isNearTo(defense.pos)) {
                cp.moveTo(defense);
            } else {
                cp.repair(defense);
            }
        } else {
            //找不到需要巩固的防御工事就重新决定之后的工作
            cp.memory.state = "look";
            cp.memory.defenseId = null;
        }
    }
};