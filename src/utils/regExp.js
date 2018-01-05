import {check} from 'UTILS/ajax'
const regExp = {
    /**
     * [checkPhone 手机和固话验证]
     * @Author   wyp
     * @DateTime 2017-12-03
     * @param    {array}    rule        [规则]
     * @param    {string}   value       [字段的值]
     * @param    {fn}       callback    [callback]
     * @return   {fn}       callback    [返回值]
     */
    checkPhone: function(rule, value, callback) {
        let length = value.length
        if (!((value.length === 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value)) || (value.length === 12 && /^(([0+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/.test(value)))) {
            callback('格式错误！')
        }
        // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
        callback()
    },
    /**
     * [checkName 检查表单字段唯一]
     * @Author   szh
     * @DateTime 2018-01-03
     * @param    {string}   field    [字段的名称]
     * @param    {string}   value    [字段的值]
     * @param    {string}   model    [字段所属于的后台模块]
     * @param    {string}   fieldTxt [字段的显示名称]
     * @return   {string||void}            [返回值]
     */
    checkFormField: function(field, value, model, fieldTxt) {
        return new Promise(resolve => {
            if (value) {
                check({
                    field: field,
                    value: value,
                    model: model
                })
                .then(res => {
                    if (res.data === true) {
                        resolve()
                    } else {
                        resolve(`该${fieldTxt}已经存在`)
                    }
                })
            } else {
                resolve(`请输入${fieldTxt}`)
            }
        })
    }
}

module.exports = regExp
