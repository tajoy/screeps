/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utility'); // -> 'a thing'
 **/
var getType = Object.prototype.toString;

var getTypeName = function (o) {
    var str = getType.call(o);
    return str.substr(8, str.length - 9);
};

var isType = function (o, t) {
    return getType.call(o) == "[object " + t + "]";
};
var isString = function (o) {
    return isType(o, "String");
};
var isObject = function (o) {
    return isType(o, "Object");
};
var isArray = function (o) {
    return isType(o, "Array");
};
var isNull = function (o) {
    return isType(o, "Null");
};
var isNumber = function (o) {
    return isType(o, "Number");
};
var isUndefined = function (o) {
    return isType(o, "Undefined");
};
var isFunction = function (o) {
    return isType(o, "Function");
};


var randomSelectArray = function (arr) {
    if (!isArray(arr)) return null;
    if (arr.length <= 0) return null;

    var n = Math.floor(Math.random() * arr.length + 1) - 1;
    return arr[n];
};

module.exports = {
    getTypeName: getTypeName,
    isType: isType,
    isString: isString,
    isObject: isObject,
    isArray: isArray,
    isNull: isNull,
    isNumber: isNumber,
    isUndefined: isUndefined,
    isFunction: isFunction,
    randomSelectArray: randomSelectArray
};