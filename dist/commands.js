/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('commands'); // -> 'a thing'
**/



module.exports = {
    buildRoad:function(_rm,x,y){
        var rm = Game.rooms[_rm];
        rm.createConstructionSite(x,y,STRUCTURE_ROAD);
    },
    buildRoads:function(_rm,from,to){
        var rm = Game.rooms[_rm];
        var path = rm.findPath(from,to);
        for(var i in path){
            rm.createConstructionSite(path[i].x,path[i].y,STRUCTURE_ROAD);
        }
    },
}