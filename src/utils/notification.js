const model = {
    Project: '项目',
    Problem: '问题',
    Task: '任务'
}
const types = {
    add: '新增',
    edit: '更新',
    delete: '删除',
    used: '采纳', // 问题
    status: '状态', // 任务
    over: '已超时', // 任务
}

const ntfc = {
    /**
     * [ntfcTitle 把通知转换成中文标题]
     * @Author   szh
     * @DateTime 2018-01-19
     * @param    {Object}   notification [通知数据]
     * @return   {String}                [通知中文字符]
     */
    ntfcTitle: function(notification) {
        let data = JSON.parse(notification.data)
        let sender = notification.sender
        if (!sender) {
            sender = {
                realname: ''
            }
        }
        let msg = ''
        if (
            notification.type === 'add' ||
            notification.type === 'edit' ||
            notification.type === 'delete'
        ) {
            msg = `${sender.realname}${types[notification.type]}`
            if (notification.model === 'Project') {
                msg = '您参与了' + msg + `的${model[notification.model]}：${data.name}`
            } else if (notification.model === 'Problem') {
                if (data.title) { // 问题
                    msg += `了${model[notification.model]}：${data.title}`
                } else { // 答案
                    msg = `在您的问题${data.Problem.title}中,${sender.realname}${types[notification.type]}答案`
                }
            } else if (notification.model === 'Task') { // 任务
                msg = '您参与了' + msg + `的${model[notification.model]}：${data.content}`
            }
        } else if (notification.type === 'used') { // 被采纳
            msg = `在问题${data.Problem.title}中,${sender.realname}${types[notification.type]}您的答案`
        } else if (notification.type === 'status') { // 任务状态改变
            let status = data.Users[0].status === '1' ? '开始' : '完成'
            msg = `${sender.realname}${status}了任务：${data.content}`
        } else if (notification.type === 'over') { // 系统设置任务状态超时
            msg = `${model[notification.model]}${data.content}已超时`
        }
        return msg
    },
    /**
     * [ntfcUrl 把通知转换成跳转路径]
     * @Author   szh
     * @DateTime 2018-01-19
     * @param    {Object}   notification [通知数据]
     * @return   {String}                [通知中文字符]
     */
    ntfcUrl: function(notification) {
        let data = JSON.parse(notification.data)
        let url = ''
        switch (notification.model) {
            case 'Project':
                url = `/project/info/${data.id}`
                break
            case 'Problem':
                url = data.Problem ? `/project/problem/${data.Problem.id}` : `/project/problem/${data.id}`
                break
            case 'Task':
                url = `/personal/my-mission`
                break
        }
        return url
    },
    ntfcDesc: function(n) {
        if (n.type === 'status') {
            let status = n.data.Users[0].status === '1' ? '开始' : '完成'
            return ` ${status} ${model[n.model]}：${n.data.content}`
        } else if (n.type === 'over') {
            return `发布的${model[n.model]}：${n.data.content}${types[n.type]}`
        } else {
            if (n.model === 'Project') {
                return ` ${types[n.type]} ${model[n.model]}：${n.data.name}`
            } else if (n.model === 'Task') {
                return ` ${types[n.type]} ${model[n.model]}：${n.data.content}`
            }
        }
    }
}

module.exports = ntfc
