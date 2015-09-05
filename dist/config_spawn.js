/**
 * Created by Jacky on 2015.09.04.
 *
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('config_spawn'); // -> 'a thing'
 **/

var utility = require("utility");

function build_body(option) {
    if (!utility.isObject(option)) return [];
    var ret = [];
    for (var key in option) {
        var body_part = null;
        switch (key) {
            case "MOVE":
                body_part = MOVE;
                break;
            case "WORK":
                body_part = WORK;
                break;
            case "CARRY":
                body_part = CARRY;
                break;
            case "ATTACK":
                body_part = ATTACK;
                break;
            case "RANGED_ATTACK":
                body_part = RANGED_ATTACK;
                break;
            case "HEAL":
                body_part = HEAL;
                break;
            case "TOUGH":
            default :
                body_part = TOUGH;
                break;
        }
        for (var j = 0; j < option[key]; j++) {
            ret.push(body_part);
        }
    }

    return ret;
}

function build_body_array(options) {
    if (!utility.isArray(options)) return [];
    var ret = [];
    for (var i = 0; i < options.length; i++) {
        ret.push(build_body(options[i]));
    }
    return ret;
}


module.exports = function () {
    //从上到下的顺序, 优先级由高至低排列

    if (!Memory.config.spawn.worker) {
        Memory.config.spawn.worker = build_body_array([
            {WORK: 3, CARRY: 3, MOVE: 3},//600
            {WORK: 3, CARRY: 2, MOVE: 2},//500
            {WORK: 2, CARRY: 2, MOVE: 2},//400
            {WORK: 2, CARRY: 1, MOVE: 1},//300
        ]);
    }


    if (!Memory.config.spawn.miner) {
        Memory.config.spawn.miner = build_body_array([
            //{WORK: 6, CARRY: 3, MOVE: 1},//800
            //{WORK: 5, CARRY: 2, MOVE: 1},//650
            //{WORK: 4, CARRY: 2, MOVE: 1},//550
            {WORK: 3, CARRY: 5, MOVE: 1},//600
            {WORK: 2, CARRY: 3, MOVE: 1},//400
            {WORK: 1, CARRY: 1, MOVE: 1},//200
            {WORK: 1, MOVE: 1},//150
        ]);
    }

    if (!Memory.config.spawn.gleaner) {
        Memory.config.spawn.gleaner = build_body_array([
            {CARRY: 8, MOVE: 10},//900
            {CARRY: 6, MOVE: 8},//700
            {CARRY: 4, MOVE: 6},//500
            {CARRY: 3, MOVE: 3},//300
            {CARRY: 2, MOVE: 2},//200
            {CARRY: 1, MOVE: 1},//100
        ]);
    }


    if (!Memory.config.spawn.builder) {
        Memory.config.spawn.builder = build_body_array([
            {WORK: 3, CARRY: 3, MOVE: 3},//600
            {WORK: 3, CARRY: 2, MOVE: 2},//500
            {WORK: 2, CARRY: 2, MOVE: 2},//400
            {WORK: 2, CARRY: 1, MOVE: 1},//300
        ]);
    }

    if (!Memory.config.spawn.guarder) {
        Memory.config.spawn.guarder = build_body_array([
            {ATTACK: 4, MOVE: 6},//620
            {ATTACK: 4, MOVE: 5},//570
            {ATTACK: 3, MOVE: 5},//490
            {ATTACK: 3, MOVE: 4},//440
            {ATTACK: 2, MOVE: 3},//310
        ]);
    }

    if (!Memory.config.spawn.transporter) {
        Memory.config.spawn.transporter = build_body_array([
            {CARRY: 6, MOVE: 6},//600
            {CARRY: 5, MOVE: 5},//500
            {CARRY: 4, MOVE: 4},//400
            {CARRY: 3, MOVE: 3},//300
        ]);
    }
}
;