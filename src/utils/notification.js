const model = {
    Project: '项目',
    Problem: '问题',
    Task: '任务'
}
const types = {
    add: '新增',
    edit: '更新',
    delete: '删除',
    used: '采纳',
    status: '状态'
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
        let msg = ''
        if (
            notification.type === 'add' ||
            notification.type === 'edit' ||
            notification.type === 'delete'
        ) {
            msg = `${sender.realname}${types[notification.type]}`
            if (notification.model === 'Project') {
                msg += `${model[notification.model]}${data.name}`
            } else if (notification.model === 'Problem') {
                console.log(data)
                if (data.title) { // 问题
                    msg += `${model[notification.model]}${data.title}`
                } else { // 答案
                    msg = `在您的问题${data.Problem.title}中,${sender.realname}${types[notification.type]}答案`
                }
            } else if (notification.model === 'Task') {
                msg += `${model[notification.model]}${data.content}`
            }
        } else if (notification.type === 'used') { // 被采纳
            msg = `在问题${data.Problem.title}中,${sender.realname}${types[notification.type]}您的答案`
        } else if (notification.type === 'status') { // 任务状态改变
            let status = data.Users[0].status === '1' ? '开始' : '完成'
            msg = `${sender.realname}${status}了任务`
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
        let sender = notification.sender
        // const modelFn = {
        //     Project: (data) => {
        //         if (ntfc.type === 'add') {
        //             return <div>{ntfc.id}</div>
        //         } else if (ntfc.type === 'edit') {
        //             return <div>{ntfc.id}</div>
        //         } else if (ntfc.type === 'delete') {
        //             return <div>{ntfc.id}</div>
        //         }
        //     },
        //     Problem: (data) => {
        //         if (ntfc.type === 'add') {
        //             return <div>{ntfc.id}</div>
        //         } else if (ntfc.type === 'edit') {
        //             return <div>{ntfc.id}</div>
        //         } else if (ntfc.type === 'delete') {
        //             return <div>{ntfc.id}</div>
        //         }
        //     },
        //     Task: (data) => {
        //         let users = ''
        //         // data.Users.forEach(u => {
        //         //     users += `${u.realname}、`
        //         // })
        //         // users = users.substring(0, users.length - 1)
        //         if (ntfc.type === 'add') {
        //             return <div>{`${ntfc.send_uid}发布了新任务,执行者有你`}</div>
        //         } else if (ntfc.type === 'edit') {
        //             return <div>{`${ntfc.send_uid}更新了一个任务,执行者有你`}</div>
        //         } else if (ntfc.type === 'delete') {
        //             return <div>{`${ntfc.send_uid}删除了一个任务,执行者有你`}</div>
        //         }
        //     }
        // }
        // return modelFn[ntfc.model](data)
        let msg = ''
        if (
            notification.type === 'add' ||
            notification.type === 'edit' ||
            notification.type === 'delete'
        ) {
            msg = `${sender.realname}${types[notification.type]}`
            if (notification.model === 'Project') {
                msg += `${model[notification.model]}${data.name}`
            } else if (notification.model === 'Problem') {
                console.log(data)
                if (data.title) { // 问题
                    msg += `${model[notification.model]}${data.title}`
                } else { // 答案
                    msg += `回答了您的${data.title}`
                }
            } else if (notification.model === 'Task') {
                msg += `${model[notification.model]}${data.content}`
            }
        } else if (notification.type === 'used') {
            msg = `${sender.realname}${types[notification.type]}您的答案`
        } else if (notification.type === 'status') {
            msg = `${sender.realname}`
        } else if (notification.type === 'over') {
            msg = `${types[notification.type]}${data.content}已超时`
        }
        return '#'
    }
}

module.exports = ntfc
