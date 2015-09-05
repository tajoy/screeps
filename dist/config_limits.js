/**
 * Created by Jacky on 2015.09.04.
 *
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('config_limits'); // -> 'a thing'
 **/



module.exports = function () {
    //在各个房间内各工种需要保持的数量
    //从上到下的顺序与creep生产的优先级相关, 优先级由高到低
    //前面的生产了足够的数量以后才会生产下面的工种
    Memory.config.creeps_limits = {
        "sim": [
            //{role: "worker", limit: 6},
            {role: "miner", limit: 2},
            {role: "gleaner", limit: 4},
            {role: "builder", limit: 2},
            //{role: "transporter", limit: 1},
            //{role: "guarder", limit: 1},
        ],
        "W11N4": [
            //{role: "worker", limit: 6},
            {role: "miner", limit: 2},
            {role: "transporter", limit: 1},
            {role: "gleaner", limit: 3},
            {role: "builder", limit: 4},
            //{role: "guarder", limit: 1},
        ]
    };
};