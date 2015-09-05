

/*************************/
/*        载入模块       */
/*************************/
var roles = require('roles');
/*************************/
/*          配置         */
/*************************/
//初始化内存结构
require('init_memory_and_config')();
var log = require("log");

if (Memory.config && Memory.config.isPause) {
    log("script is pauesed!");
    return;
}


log("====================== BEGIN TICK: " + Game.time + " ======================");


/*************************/
/*        运行模块       */
/*************************/
//导入prototype方法
require('prototypes')();
//保持creep各角色的数量
require('keep_creep')();



/*************************/
/*         主循环        */
/*************************/
for (var name in Game.creeps) {
    var creep = Game.creeps[name];

    var rcl = creep.room.controller;
    if (rcl.ticksToDowngrade < Memory.config.warning_ticks_downgrade_low) {
        msg = "!!!!!!!! WARNING: RCL["
            + rcl.room.name
            + "] going to be downgrade in ["
            + rcl.ticksToDowngrade
            + "] ticks !!!!!!!!";
        log(msg);
        Game.notify(
            msg,
            10  // Interval for 10 minutes
        );
    }

    //每个角色执行相应的动作
    if (creep.memory.role) {
        roles.action(creep);
    }
}

log("====================== END TICK: " + Game.time + " ======================");
log();
