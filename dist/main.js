
console.log("====================== BEGIN TICK: "+Game.time+" ======================");


/*************************/
/*          配置         */
/*************************/
//初始化内存结构
require('init_memory')();
//排列在前面的先诞生
Memory.config.creeps_limits = [
    ["worker"  , 6 ],
    ["builder" , 2 ],
    ["guarder" , 1 ],
];

/*************************/
/*        运行模块       */
/*************************/
//导入prototype方法
require('prototypes')();
//保持creep各角色的数量
require('role_keep')();


/*************************/
/*        载入模块       */
/*************************/
var roles = require('roles');



/*************************/
/*         主循环        */
/*************************/
for (var name in Game.creeps) {
    var creep = Game.creeps[name];

    //每个角色执行相应的动作
    if (creep.memory.role && roles[creep.memory.role]) {
        roles[creep.memory.role].action(creep);
    }
}


console.log("====================== END TICK: "+Game.time+" ======================");
console.log();
