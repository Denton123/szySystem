import React from 'react'
import { List, Button, Modal, Toast } from 'antd-mobile'
import moment from 'moment'

import { resetObject, reFormatDate } from '../../../../utils/utils'
import { ajax, mShow } from '../../../../utils/ajax'

const alert = Modal.alert
const prompt = Modal.prompt

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
                data['currentUserTask']['start_date'] = reFormatDate(data['currentUserTask']['start_date'])
                data['currentUserTask']['end_date'] = reFormatDate(data['currentUserTask']['end_date'])
                this.setState({
                    taskData: data
                })
            })
    }

    // 设置任务状态
    handleTaskStatus = (e) => {
        console.log(e.target.dataset['tid'])
        let tid = e.target.dataset['tid']
        let status = e.target.dataset['status']
        alert('任务', `是否${status === '1' ? '开始任务' : '完成个人任务'}`, [
            {text: '取消'},
            {
                text: '确定',
                onPress: () => {
                    ajax('put', `/m/task/${tid}/user/${this.props.user.id}/status`, {status: status})
                        .then(res => {
                            this.setState({
                                taskData: res.data
                            })
                        })
                        .catch(() => {
                            Toast.info('网络错误', 1)
                        })
                }
            },
        ])
    }

    // 直接完成任务
    setTaskCompelete = (e) => {
        let tid = e.target.dataset['tid']
        alert('任务', `是否直接完成任务`, [
            {text: '取消'},
            {
                text: '确定',
                onPress: () => {
                    ajax('put', `/m/task/${tid}/user/${this.props.user.id}/compelete`, {status: '2'})
                        .then(res => {
                            this.setState({
                                taskData: res.data
                            })
                        })
                        .catch(() => {
                            Toast.info('保存失败', 1)
                        })
                }
            },
        ])
    }

    // 提交任务备注
    submitTaskMemo = (e) => {
        let tid = e.target.dataset['tid']
        prompt(
            '备注',
            '填写备注后不能修改',
            [
                {text: '取消'},
                {
                    text: '提交',
                    onPress: text => {
                        ajax('put', `/m/task/${tid}/user/${this.props.user.id}/memo`, {memo: text})
                        .then(res => {
                            if (res.data.child.length > 0) {
                                this.setState({
                                    taskData: res.data.child[0]
                                })
                            } else {
                                this.setState({
                                    taskData: res.data
                                })
                            }
                        })
                        .catch(() => {
                            Toast.info('提交失败', 1)
                        })
                    }
                },
            ],
        )
    }

    operation = (taskData) => {
        let searchArr = this.props.location.search.substr(1).split('&'),
            urlSearch = {}
        searchArr.forEach(sa => {
            let arr = sa.split('=')
            urlSearch[arr[0]] = arr[1]
        })
        let tid = urlSearch['task_id']
        const Start = () => (
            <List.Item>
                <Button type="primary" data-tid={tid} data-status="1" onClick={this.handleTaskStatus} >开始任务</Button>
            </List.Item>
        )
        const Waiting = () => (
            <List.Item>
                <Button type="primary" data-tid={tid} data-status="2" onClick={this.handleTaskStatus} >完成个人任务</Button>
            </List.Item>
        )
        const Compelete = () => (
            <List.Item>
                <Button type="primary" data-tid={tid} onClick={this.setTaskCompelete} >完成任务</Button>
            </List.Item>
        )
        const Memo = () => (
            <List.Item>
                <Button type="primary" data-tid={tid} onClick={this.submitTaskMemo} >填写备注</Button>
            </List.Item>
        )
        let Action
        switch (taskData.status) {
            case '0':
                Action = () => (<Start />)
                break
            case '1':
                Action = () => (
                    <div>
                        <Waiting />
                        <Compelete />
                    </div>
                )
                break
            case '2':
                Action = () => (
                    <div>
                        <List.Item extra={'已完成'}>
                            状态
                        </List.Item>
                        {taskData.currentUserTask.memo ? null : (<Memo />)}
                    </div>
                )
                break
            case '3':
                Action = () => (<List.Item extra={'超时'}>状态</List.Item>)
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
                <List.Item multipleLine>
                    实际开始时间
                    <List.Item.Brief>{taskData.currentUserTask && taskData.currentUserTask.start_date ? taskData.currentUserTask.start_date : '无'}</List.Item.Brief>
                </List.Item>
                <List.Item multipleLine>
                    实际结束时间
                    <List.Item.Brief>{taskData.currentUserTask && taskData.currentUserTask.end_date ? taskData.currentUserTask.end_date : '无'}</List.Item.Brief>
                </List.Item>
                <List.Item>
                    备注
                    <List.Item.Brief>{taskData.currentUserTask && taskData.currentUserTask.memo ? taskData.currentUserTask.memo : '无' }</List.Item.Brief>
                </List.Item>
                {taskData.status && this.operation(taskData)}
            </List>
        )
    }
}

export default TaskDetail
