//  index      /:model                   get     获取数据列表
//  store      /:model                   post    保存一条新的数据
//  show       /:model/{model_id}        get     获取对应id的一条数据
//  update     /:model/{model_id}        put     更新对应id的数据
//  destroy    /:model/{model_id}        delete  删除对应id的数据

import { apiUrl, isObject, valueToMoment } from 'UTILS/utils'

/**
 * [ajax 后台请求]
 * @Author   szh
 * @DateTime 2017-12-05
 * @param    {String}   type    [请求方法类型]
 * @param    {String}   url     [请求路径]
 * @param    {Object}   data    [请求时附带的参数]
 * @param    {Boolean}  hasFile [是否有文件]
 * @return   {Object}           [Promise对象]
 */
function ajax(type, url, data = {}, hasFile = false) {
    return new Promise((resolve, reject) => {
        let config = {}
        if (type === ' get') {
            let params = {
                params: data
            }
            data = params
        }
        if (hasFile) {
            config = {
                headers: {
                    'Content-Type': 'multiple/form-data'
                }
            }
            let fd = new FormData()
            for (let i in data) {
                if (data[i] === null) continue
                if (i.indexOf('date') > -1) {
                    fd.append(i, valueToMoment(data[i]))
                    continue
                }
                if (data[i] instanceof Blob) { // 如果是文件
                    fd.append(i, data[i])
                    continue
                }
                if (isObject(data[i])) {
                    // antd上传组件改变后返回{ file: { /* ... */ }, fileList: [ /* ... */ ], event: { /* ... */ },}
                    if (data[i].fileList) {
                        data[i].fileList.forEach(fl => {
                            fd.append(i, fl)
                        })
                    }
                } else {
                    fd.append(i, data[i])
                }
            }
            data = fd
            console.log('form-data  -------- ')
            console.log(data)
        }
        axios[type](url, data, config)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                if (err.response.status === 500) {
                    // 服务器错误
                }
                // 统一错误处理
                // TODO
                reject(err)
            })
    })
}

const commonApi = {
    ajax: ajax,
    index: function(url, data) {
        return ajax('get', apiUrl(url), data)
    },
    store: function(url, data, hasFile) {
        return ajax('post', apiUrl(url), data, hasFile)
    },
    show: function(url) {
        return ajax('get', apiUrl(url))
    },
    update: function(url, data, hasFile) {
        return ajax('put', apiUrl(url), data, hasFile)
    },
    destroy: function(url) {
        return ajax('delete', apiUrl(url))
    }
}

module.exports = commonApi
