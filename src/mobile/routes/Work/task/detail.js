import React from 'react'
import { List, Button } from 'antd-mobile'

import { resetObject } from '../../../../utils/utils'
import { ajax, mShow } from '../../../../utils/ajax'

const taskStatus = {
    '0': '等待中',
    '1': '进行中',
    '2': '已完成',
    '3': '超时',
}

class TaskDetail extends React.Component {
    constructor(props) {
        super(props)
        // 根据路由查询来确定是新增还是编辑
        // ?type=add
        let searchArr = this.props.location.search.substr(1).split('&'),
            urlSearch = {}
        searchArr.forEach(sa => {
            let arr = sa.split('=')
            urlSearch[arr[0]] = arr[1]
        })
        this.state = {
            // 父组件传参数
            ...urlSearch,
            // 当前任务数据
            taskData: {},
        }
    }
    componentWillMount() {
        mShow(`${this.props.match.params.model}/${this.state.task_id}`)
            .then(res => {
                let data = res.data
                data['currentUserTask'] = data.Users.find(u => u.id === this.props.user.id).User_Task
                this.setState({
                    taskData: data
                })
            })
    }

    Operation = (status) => {
        const Start = () => (
            <List.Item>
                <Button type="primary" inline >开始任务</Button>
            </List.Item>
        )
        const Waiting = () => (<Button type="primary" inline >完成个人任务</Button>)
        const Compelete = () => (<Button type="primary" inline >完成任务</Button>)
        const Memo = () => (
            <List.Item>
                <Button type="primary" inline >填写备注</Button>
            </List.Item>
        )
        let Action
        switch (status) {
            case '0':
                Action = () => (<Start />)
                break
            case '1':
                Action = () => (
                    <List.Item>
                        <Waiting /><Compelete />
                    </List.Item>
                )
                break
            case '2':
                Action = () => (
                    <List.Item>
                        <span className="mr-10">已完成</span>
                        {record['Users'][0]['memo'] ? null : (<Memo />)}
                    </List.Item>
                )
                break
            case '3':
                Action = () => (<List.Item>超时</List.Item>)
                break
        }
        return (<Action />)
    }

    render() {
        const {
            taskData,
        } = this.state

        return (
            <List>
                <List.Item multipleLine>
                    所属项目
                    <List.Item.Brief>{taskData.Project ? taskData.Project.name : '无'}</List.Item.Brief>
                </List.Item>
                <List.Item multipleLine>
                    任务内容
                    <List.Item.Brief>{taskData.content}</List.Item.Brief>
                </List.Item>
                <List.Item multipleLine extra={taskData.status && taskStatus[taskData.status]}>
                    任务状态
                </List.Item>
                <List.Item multipleLine extra={taskData.plan_start_date}>
                    任务计划开始时间
                </List.Item>
                <List.Item multipleLine extra={taskData.plan_end_date}>
                    任务计划结束时间
                </List.Item>
                <List.Item multipleLine extra={taskData.currentUserTask && taskData.currentUserTask.start_date ? taskData.currentUserTask.start_date : '无'}>
                    实际开始时间
                </List.Item>
                <List.Item multipleLine extra={taskData.currentUserTask && taskData.currentUserTask.end_date ? taskData.currentUserTask.end_date : '无'}>
                    实际结束时间
                </List.Item>
                <List.Item>
                    备注
                    <List.Item.Brief>{taskData.currentUserTask && taskData.currentUserTask.memo ? taskData.currentUserTask.memo : '无' }</List.Item.Brief>
                </List.Item>
            </List>
        )
    }
}

export default TaskDetail

// module.exports = function(opts) {
//     class MyMission extends Component {
//         state = {
//             // 默认显示全部任务
//             status: this.props.location.state && this.props.location.state.status ? this.props.location.state.status : 'all',
//             // 默认的项目
//             defaultProject: undefined,
//             // 全部项目数据
//             projectData: [],
//             // 默认的任务id
//             currentTaskId: null
//         }

//         /**
//          * [改变状态]
//          * @Author   szh
//          * @DateTime 2018-01-26
//          * @param    {Object}   e [event事件]
//          */
//         handleStatusChange = (e) => {
//             let val = e.target.value
//             this.setState({
//                 status: val
//             })
//             let data = {
//                 ...this.props.location.state,
//                 page: 1
//             }
//             if (opts.hasProject) { // 有项目的页面
//                 if (this.state.defaultProject) {
//                     data['project_id'] = this.state.defaultProject
//                 } else {
//                     data['project_id'] = 'notnull'
//                 }
//             } else {
//                 data['project_id'] = 'null'
//             }
//             data['status'] = val
//             if (data['status'] === 'all') {
//                 delete data['status']
//             }
//             this.props.getData(
//                 data,
//                 (params) => ajax('get', `/task/${this.props.user.id}/all`, params)
//             )
//         }

//         /**
//          * [修改任务状态]
//          * @Author   szh
//          * @DateTime 2018-01-26
//          * @param    {Object}   e [event事件]
//          */
//         handleTaskStatus = (e) => {
//             let tid = e.target.dataset['tid']
//             let status = e.target.dataset['status']
//             CustomPrompt({
//                 type: 'confirm',
//                 content: <div>{`是否${status === '1' ? '开始任务' : '完成个人任务'}`}</div>,
//                 okType: 'info',
//                 onOk: () => {
//                     this.props.handleSetState('isSubmitting', true)
//                     ajax('put', `/task/${tid}/user/${this.props.user.id}/status`, {status: status})
//                         .then(res => {
//                             if (res.data.errors) {
//                                 message.error(res.data.errors.message)
//                             } else {
//                                 let dataSource = []
//                                 this.props.dataSetting.dataSource.forEach(ds => {
//                                     if (ds.id === res.data.id) {
//                                         dataSource.push(res.data)
//                                     } else {
//                                         dataSource.push(ds)
//                                     }
//                                 })
//                                 this.props.handleSetState('dataSetting', {
//                                     ...this.props.dataSetting,
//                                     dataSource: dataSource
//                                 })
//                                 this.props.handleSetState('isSubmitting', false)
//                                 message.success('保存成功')
//                                 this.props.getMyTaskStatus()
//                             }
//                         })
//                         .catch(() => {
//                             this.props.handleSetState('isSubmitting', false)
//                             message.error('保存失败')
//                         })
//                 }
//             })
//         }

//         /**
//          * [下拉选择项目改变时的回调]
//          * @Author   szh
//          * @DateTime 2018-01-26
//          * @param    {Number}   id [项目id]
//          */
//         projectChange = (id) => {
//             this.setState({
//                 defaultProject: id
//             })
//             if (!id) {
//                 id = 'notnull'
//             }
//             let data = {
//                 ...this.props.location.state,
//                 page: 1,
//                 project_id: id,
//             }
//             if (this.state.status !== 'all') { // 如果任务状态为全部的时候，不传值到后台
//                 data['status'] = this.state.status
//             }
//             this.props.getData(
//                 data,
//                 (params) => ajax('get', `/task/${this.props.user.id}/all`, params)
//             )
//         }

//         setTaskCompelete = (e) => {
//             let tid = e.target.dataset['tid']
//             CustomPrompt({
//                 type: 'confirm',
//                 content: <div>{`是否完成任务,完成任务后其他的任务执行者同时完成任务`}</div>,
//                 okType: 'info',
//                 onOk: () => {
//                     this.props.handleSetState('isSubmitting', true)
//                     ajax('put', `/task/${tid}/user/${this.props.user.id}/compelete`, {status: '2'})
//                         .then(res => {
//                             if (res.data.errors) {
//                                 message.error(res.data.errors.message)
//                             } else {
//                                 let dataSource = []
//                                 this.props.dataSetting.dataSource.forEach(ds => {
//                                     if (ds.id === res.data.id) {
//                                         dataSource.push(res.data)
//                                     } else {
//                                         dataSource.push(ds)
//                                     }
//                                 })
//                                 this.props.handleSetState('dataSetting', {
//                                     ...this.props.dataSetting,
//                                     dataSource: dataSource
//                                 })
//                                 this.props.handleSetState('isSubmitting', false)
//                                 message.success('保存成功')
//                                 this.props.getMyTaskStatus()
//                             }
//                         })
//                         .catch(() => {
//                             this.props.handleSetState('isSubmitting', false)
//                             message.error('保存失败')
//                         })
//                 }
//             })
//         }

//         openModal = (e) => {
//             let tid = e.target.dataset['tid']
//             this.props.handleSetState('modalSetting', {
//                 ...this.props.modalSetting,
//                 visible: true,
//                 title: `填写备注`
//             })
//             this.setState({
//                 currentTaskId: tid
//             })
//         }

//         handleFormSubmit = (params) => {
//             CustomPrompt({
//                 type: 'confirm',
//                 content: <div>{`确认后，备注不能修改，是否要提交`}</div>,
//                 okType: 'warning',
//                 onOk: () => {
//                     this.props.handleSetState('isSubmitting', true)
//                     ajax('put', `/task/${this.state.currentTaskId}/user/${this.props.user.id}/memo`, params)
//                         .then(res => {
//                             if (res.data.errors) {
//                                 message.error(res.data.errors.message)
//                             } else {
//                                 let dataSource = []
//                                 this.props.dataSetting.dataSource.forEach(ds => {
//                                     if (ds.id === res.data.id) {
//                                         dataSource.push(res.data)
//                                     } else {
//                                         dataSource.push(ds)
//                                     }
//                                 })
//                                 this.props.handleSetState('dataSetting', {
//                                     ...this.props.dataSetting,
//                                     dataSource: dataSource
//                                 })
//                                 this.props.handleSetState('isSubmitting', false)
//                                 this.props.handleSetState('modalSetting', {
//                                     ...this.props.modalSetting,
//                                     visible: false,
//                                 })
//                                 this.props.handleSetState('formFieldsValues', {
//                                     ...this.props.formFieldsValues,
//                                     memo: {
//                                         value: null
//                                     },
//                                 })
//                                 message.success('保存成功')
//                             }
//                         })
//                         .catch(() => {
//                             this.props.handleSetState('isSubmitting', false)
//                             message.error('保存失败')
//                         })
//                 }
//             })
//         }
