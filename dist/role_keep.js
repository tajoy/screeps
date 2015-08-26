/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role_keep'); // -> 'a thing'
 */
var utility = require('utility');
var roles = require('roles');
module.exports = function(){
    var limits = Memory.config.creeps_limits;

    if (!utility.isArray(limits)) return;
    //统计各个房间内的creep各种角色数目
    var rooms_count = {};
    
    
    console.log("role_keep doing ...");
    
    //初始化计数器
    for(var i in Game.spawns) {
        var rmName = Game.spawns[i].room.name;
        rooms_count[rmName]={};
        
        for(var i in limits){
            var role = limits[i][0]
            rooms_count[rmName][role] = 0; 
        }
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var rmName = creep.room.name;
        var role = creep.memory.role;
        if(rooms_count[rmName]==null)
        {
            rooms_count[rmName]={};
        }
        if(rooms_count[rmName][role]!=null)
        {
            rooms_count[rmName][role] += 1;
        }
    }

    //保存
    Memory.status.creeps.count = rooms_count;


    //打印统计项:
    for(var rmName in rooms_count){
        var count = rooms_count[rmName];
        console.log("creep count in room["+rmName+"]:");
        for(var i in limits){
            var role = limits[i][0]
            console.log("    "+role+" = " + count[role]);
        }
    }
    
    //遍历所有房间
    for(var rmName in rooms_count){
        var count = rooms_count[rmName];
        //检测各角色限制
        for (var i = 0; i < limits.length; i++) {
            var limit = limits[i];
            var role = limit[0]
            var num = limit[1]
            if (count[role]==null) continue;
            if (!utility.isNumber(count[role])) continue;
            //低于限制, 产生相应角色
            if(count[role]<num){
                var _spawns = Game.rooms[rmName].find(FIND_MY_SPAWNS);
                if(_spawns.length>0){
                    roles[role].spawn(_spawns[0]);
                    return;
                }
            }
        }
    }
    
    
};




