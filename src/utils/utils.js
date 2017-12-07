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
                // 在选择日期后，使用清除日期按钮删除选择时间后返回的值是['', '']
                // 转化成moment会导致日期组件出现NaN
                // 需要返回null
                if (v.length > 0) {
                    temp.push(moment(v, format))
                }
            })
            if (temp.length === 0) return null
            return temp
        } else {
            return moment(value, format)
        }
    },
    resetObject: function(objectToHandle) {
        // 如果当前对象的属性中存在对象，则将属性中的对象的属性变为当前对象的属性
        let obj = {}
        for (let i in objectToHandle) {
            if (objectToHandle[i] === null || objectToHandle[i] === undefined) {
                obj[i] = objectToHandle[i]
                continue
            }
            if (utils.isObject(objectToHandle[i])) {
                obj = Object.assign({}, obj, utils.resetObject(objectToHandle[i]))
            } else {
                obj[i] = objectToHandle[i]
            }
        }
        return obj
    }
}

module.exports = utils
