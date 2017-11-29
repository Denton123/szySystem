module.exports = {
    isObject: function(objectToCheck) {
        return Object.prototype.toString.call(objectToCheck) === '[object Object]'
    }
}
