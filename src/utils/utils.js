import moment from 'moment'
const utils = {
    isObject: function(objectToCheck) {
        return Object.prototype.toString.call(objectToCheck) === '[object Object]'
    },
    isArray: function(ArrayToCheck) {
        return Object.prototype.toString.call(ArrayToCheck) === '[object Array]'
    },
    isFunction: function(FunctionToCheck) {
        return Object.prototype.toString.call(FunctionToCheck) === '[object Function]'
    },
    /**
     * [apiUrl api接口路径处理]
     * @Author   szh
     * @DateTime 2017-12-06
     * @param    {String}   url [请求接口地址]
     * @return   {String}       [加上api前缀的请求接口地址]
     */
    apiUrl: function(url) {
        let regx = /^\/{1,}/g
        url = url.replace(regx, '')
        return `/api/${url}`
    },
    /**
     * [valueToMoment antd时间组件在传值需要moment]
     * @Author   szh
     * @DateTime 2017-12-06
     * @param    {null||Str||Arr}   value  [时间变成字符串后的值]
     * @param    {String}           format [时间格式，可选]
     * @return   {null||Str||Arr}          [根据value决定返回值类型]
     */
    valueToMoment: function(value, format = 'YYYY-MM-DD') {
        if (value === null || value === undefined) return value
        if (utils.isArray(value)) {
            let temp = []
            value.forEach(v => {
                temp.push(moment(v, format))
            })
            return temp
        } else {
            return moment(value, format)
        }
    }
}

module.exports = utils
