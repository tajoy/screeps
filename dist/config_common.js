/**
 * Created by Jacky on 2015-09-04 20:20:31.
 *
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('config_common'); // -> 'a thing'
 **/



module.exports = function () {
    //是否为调试模式, 调试模式不输出任何日志, 方便查看错误信息
    Memory.config.isDebug = false;

    //RCL(房间控制器)降级时间警告时间下限
    Memory.config.warning_ticks_downgrade_low = 10000;

    //当前可用角色(role)
    Memory.config.roles = [
        "worker",
        "gleaner",
        "miner",
        "builder",
        "transporter",
        "guarder"
    ];


    //从获取仓库(storage)能量的最低限制(大于该值才会获取能量用来做工)
    Memory.config.transfer_storage_low = 3000;

    //builder工作时的优先级, 从上至下,由高到低
    //同时设置是否干某些事
    Memory.config.builder_priority = [
        "BUILD",//修建建筑物
        //"FIX",//修复建筑物
        //"UPRCL",//升级RCL(房间控制器)
        //"UPDEF",//升级防御工事
    ];

    //builder是否升级相应房间的控制器
    //未配置的走全局的配置
    //配置了的走其配置
    Memory.config.is_up_controller_by_room = {
        "sim": true,
        "W11N4": true
    };

    //builder是否修复建筑物
    Memory.config.is_fix_building = false;

    //builder是否升级防御工事
    Memory.config.is_up_defense = false;

    //common.allocTransfer 选择是否储存能量的地方,及其优先级顺序
    Memory.config.transfer_pos = [
        STRUCTURE_SPAWN,
        STRUCTURE_EXTENSION,
        //STRUCTURE_STORAGE,
        //STRUCTURE_LINK
    ];

    //common.allocBeTransfer 选择是否获取能量的地方,及其优先级顺序
    Memory.config.be_transfer_pos = [
        STRUCTURE_STORAGE,
        //STRUCTURE_SPAWN,
        //STRUCTURE_EXTENSION,
    ];

    //从仓库(storage)获取能量的最低限度
    Memory.config.transfer_storage_low = 3000;

    //从仓库(storage)存放能量的最高限度
    Memory.config.transfer_storage_high = 1000 * 1000; //1M

    //transporter保持(spawn和extension)与仓库(storage)所储存能量平衡的阈值
    // (spawn和extension)当前能量与之储存容量的比例与该阈值比较
    // 高于该阈值, 则从(spawn和extension)运输至仓库(storage)
    // 低于该阈值, 则从仓库(storage)运输至(spawn和extension)
    // 单位: 占(spawn和extension)当前能量总数的百分比(%)
    Memory.config.transfer_percent = 60;

    //是否优先从spawn获取/储存能量
    Memory.config.transfer_is_first_spawn = true;

};