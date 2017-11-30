module.exports = {
    isObject: function(objectToCheck) {
        return Object.prototype.toString.call(objectToCheck) === '[object Object]'
    },
    isArray: function(ArrayToCheck) {
        return Array.prototype.toString.call(ArrayToCheck) === '[object Array]'
    },
    isFunction: function(FunctionToCheck) {
        return Function.prototype.toString.call(FunctionToCheck) === '[object Function]'
    }
}
