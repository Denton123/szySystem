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
            } else {
                dataObject[i] = moment(dataObject[i]).format('YYYY-MM-DD')
            }
        }
    }
    return dataObject
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
    if (isObject(response.data)) {
        response.data = formatDate(response.data)
    }
    if (isArray(response.data)) {
        response.data.forEach(d => {
            d = formatDate(d)
        })
    }
    if (response.data.data && isArray(response.data.data)) {
        response.data.data.forEach(d => {
            d = formatDate(d)
        })
    }
    // Do something with response data
    return response
}, function(error) {
    // Do something with response error
    return Promise.reject(error)
})
