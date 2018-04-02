import React from 'react'
import { List, Button, Modal, Toast, TextareaItem } from 'antd-mobile'
import moment from 'moment'

import { resetObject, reFormatDate } from '../../../../utils/utils'
import { ajax, mShow } from '../../../../utils/ajax'

import CustomForm from '../../../components/CustomForm.js'

const alert = Modal.alert
const prompt = Modal.prompt

const taskStatus = {
    '0': '等待中',
    '1': '进行中',
    '2': '已完成',
    '3': '超时',
}

function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el
        }
        el = el.parentElement
    }
    return null
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
            modalVisible: false, // modal
        }
    }
    componentWillMount() {
        mShow(`${this.props.match.params.model}/${this.state.task_id}`)
            .then(res => {
                this.setState({
                    taskData: res.data
                })
            })
    }

    // 设置任务状态
    handleTaskStatus = (status) => {
        let tid = this.state.task_id
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
        let tid = this.state.task_id
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
        this.setState({
            modalVisible: true
        })
    }

    operation = (taskData) => {
        const Start = () => (
            <List.Item>
                <Button type="primary" onClick={() => this.handleTaskStatus('1')} >开始任务</Button>
            </List.Item>
        )
        const Waiting = () => (
            <List.Item>
                <Button type="primary" onClick={() => this.handleTaskStatus('2')} >完成个人任务</Button>
            </List.Item>
        )
        const Compelete = () => (
            <List.Item>
                <Button type="primary" onClick={this.setTaskCompelete} >完成任务</Button>
            </List.Item>
        )
        const Memo = () => (
            <List.Item>
                <Button type="primary" onClick={this.submitTaskMemo} >填写备注</Button>
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
                        {taskData.Users[0].memo ? null : (<Memo />)}
                    </div>
                )
                break
            case '3':
                Action = () => (<List.Item extra={'超时'}>状态</List.Item>)
                break
        }
        return (<Action />)
    }

    // modal
    onModalSubmit = () => {
        this.formRef.onSubmit()
    }
    onModalClose = () => {
        this.setState({
            modalVisible: false
        })
    }
    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return
        }
        const pNode = closest(e.target, '.am-modal-content')
        if (!pNode) {
            e.preventDefault()
        }
    }

    handleSubmit = (params) => {
        Toast.loading('保存中', 0)
        ajax('put', `/m/task/${this.state.taskData.id}/user/${this.props.user.id}/memo`, params)
            .then(res => {
                Toast.info('提交成功', 1)
                if (res.data.child && res.data.child.length > 0) {
                    this.setState({
                        taskData: res.data.child[0],
                        modalVisible: false
                    })
                } else {
                    this.setState({
                        taskData: res.data,
                        modalVisible: false
                    })
                }
            })
            .catch(() => {
                Toast.info('提交失败', 1)
            })
    }

    render() {
        const {
            taskData,
            modalVisible, // 控制modal显示
        } = this.state
        const formFields = [
            ({getFieldProps, getFieldError}) => (
                <TextareaItem
                    {...getFieldProps('memo', {
                        initialValue: null,
                        rules: [{required: true, message: '请输入备注'}]
                    })}
                    error={!!getFieldError('memo')}
                    onErrorClick={() => {
                        Toast.info(getFieldError('memo').join('、'), 1)
                    }}
                    rows={5}
                    count={200}
                />
            ),
        ]
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
                    <List.Item.Brief>{taskData.Users && taskData.Users[0].start_date ? taskData.Users[0].start_date : '无'}</List.Item.Brief>
                </List.Item>
                <List.Item multipleLine>
                    实际结束时间
                    <List.Item.Brief>{taskData.Users && taskData.Users[0].end_date ? taskData.Users[0].end_date : '无'}</List.Item.Brief>
                </List.Item>
                <List.Item>
                    备注
                    <List.Item.Brief>{taskData.Users && taskData.Users[0].memo ? taskData.Users[0].memo : '无' }</List.Item.Brief>
                </List.Item>
                {taskData.status && this.operation(taskData)}
                <Modal
                    visible={modalVisible}
                    transparent
                    maskClosable={false}
                    title={'备注'}
                    footer={[
                        {text: '取消', onPress: this.onModalClose},
                        {text: '提交', onPress: this.onModalSubmit}
                    ]}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                    <CustomForm
                        wrappedComponentRef={(inst) => this.formRef = inst}
                        formFields={formFields}
                        hasFormOperation={false}
                        handleSubmit={this.handleSubmit}
                    />
                </Modal>
            </List>
        )
    }
}

export default TaskDetail
