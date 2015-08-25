/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utility'); // -> 'a thing'
**/
var gettype=Object.prototype.toString;

module.exports = {
  getTypeName:function(o){
    var str = gettype.call(o);
    return str.substr(8, gettype.call(o).length - 9);
  },
  isType:function(t,o){
    return gettype.call(o)=="[object "+t+"]";
  },
  isString:function(o){
    return gettype.call(o)=="[object String]";
  },
  isObject:function(o){
    return gettype.call(o)=="[object Object]";
  },
  isArray:function(o){
    return gettype.call(o)=="[object Array]";
  },
  isNull:function(o){
    return gettype.call(o)=="[object Null]";
  },
  isNumber:function(o){
    return gettype.call(o)=="[object Number]";
  },
  isUndefined:function(o){
    return gettype.call(o)=="[object Undefined]";
  },
  isObject:function(o){
    return gettype.call(o)=="[object Object]";
  },
  isFunction:function(o){
    return gettype.call(o)=="[object Function]";
  },
};