import {message} from 'antd'
import moment from 'moment'
import {isObject, isArray} from 'UTILS/utils'

/**
 * [formatDate 处理带有后台返回带有时区的时间]
 * @Author   szh
 * @DateTime 2017-12-12
 * @param    {Object}   dataObject [后台数据对象]
 * @return   {Object}              [处理后的数据对象]
 */
function formatDate(dataObject) {
    for (let i in dataObject) {
        if (
            i.indexOf('date') > -1 ||
            i.indexOf('createdAt') > -1 ||
            i.indexOf('updatedAt') > -1 ||
            i.indexOf('deletedAt') > -1
        ) {
            if (dataObject[i] === null) continue
            if (dataObject[i].indexOf('T') > -1) {
                dataObject[i] = moment(dataObject[i]).format('YYYY-MM-DD HH:mm:ss')
            }
        }
        if (isArray(dataObject[i])) {
            handleArr(dataObject[i])
        }
    }
    return dataObject
}

/**
 * [handleArr 遍历数组]
 * @Author   szh
 * @DateTime 2017-12-19
 * @param    {array}   arr [数组]
 */
function handleArr(arr) {
    arr.forEach(a => {
        a = formatDate(a)
    })
}

// Add a request interceptor
axios.interceptors.request.use(function(config) {
    // Do something before request is sent
    return config
}, function(error) {
    // Do something with request error
    return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function(response) {
    if (response.data.data && isArray(response.data.data)) {
        handleArr(response.data.data)
    }
    if (isObject(response.data)) {
        response.data = formatDate(response.data)
    }
    if (isArray(response.data)) {
        handleArr(response.data)
    }
    // Do something with response data
    return response
}, function(error) {
    // Do something with response error
    if (error.response.status === 401) {
        message.error('权限不足')
    } else if (error.response.status === 404) {
        message.error('接口不存在')
    }
    return Promise.reject(error)
})
