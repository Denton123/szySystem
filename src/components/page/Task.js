import React from 'react'
import {
    Button,
    Radio,
    Table,
    Progress,
    Divider,
    Select,
    Input,
    Popover,
    Avatar,
    Card,
    message
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

// 引入工具方法
import {isObject, isArray, valueToMoment, momentToValue, resetObject} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomRangePicker from 'COMPONENTS/date/CustomRangePicker'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

const {TextArea} = Input
const {Option} = Select

// 获取进度的百分比
function getPercent(arr) {
    let percent = 0
    arr.forEach(c => {
        if (c.status === '1') {
            percent++
        } else if (c.status === '2') {
            percent += 2
        }
    })
    percent = ((percent / (arr.length * 2)) * 100).toFixed(0)
    return percent
}

module.exports = function(opts) {
    class Task extends React.Component {
        state = {
            // 默认显示全部任务
            status: 'all',
            // 全部用户信息
            userData: [],
            // 全部父级任务
            taskData: [],
            // 选择父级是否禁用
            taskDataDisabled: false,
            // 父任务的计划开始时间和计划结束时间
            taskDate: {}
        }

        componentDidMount() {
            let page = this.props.location.state ? this.props.location.state.page : 1
            if (opts.total) {
                this.props.getData({page: page})
            } else {
                let sid = this.props.stage.id
                this.props.getData({
                    page: page,
                    stage_id: sid
                })
            }
        }

        componentWillReceiveProps(nextProps) {
            if (!opts.total) {
                if (nextProps.stage.id !== this.props.stage.id) {
                    this.setState({
                        status: 'all'
                    })
                    this.props.getData({
                        page: 1,
                        stage_id: nextProps.stage.id
                    })
                }
            }
        }

        getAllUser = () => {
            ajax('get', '/user/all')
                .then(res => {
                    this.setState({
                        userData: res.data
                    })
                })
        }

        getAllUserByTaskId = (pid) => {
            ajax('get', `/task/${pid}/all-user`)
                .then(res => {
                    this.setState({
                        userData: res.data
                    })
                })
        }

        getAllParentsTask = () => {
            let getAllParentsTasks = opts.total
                ? ajax('get', '/task/all-parents')
                : ajax('get', '/task/all-parents', {params: {stage_id: this.props.stage.id}})
            getAllParentsTasks
                .then(res => {
                    this.setState({
                        taskData: res.data
                    })
                })
        }

        getTaskDateByTaskId = (pid) => {
            ajax('get', `/task/${pid}/date`)
                .then(res => {
                    this.setState({
                        taskDate: res.data
                    })
                })
        }

        add = (e) => {
            this.setState({
                taskDate: {},
                taskDataDisabled: false
            })
            this.getAllUser()
            this.getAllParentsTask()
            this.props.handleAdd(e)
        }

        edit = (e) => {
            if (e.target.dataset['status'] === '2') {
                message.warning('任务已经完成！')
                return
            }
            this.setState({
                taskDate: {},
                taskDataDisabled: true
            })
            let pid = e.target.dataset['pid']
            if (pid) {
                this.getAllUserByTaskId(pid)
                this.getTaskDateByTaskId(pid)
            } else {
                this.getAllUser()
            }
            this.getAllParentsTask()
            this.props.handleEdit(e)
        }

        handleFormSubmit = (values) => {
            let params = {
                status: this.props.operationType === 'add' ? '0' : this.props.formFieldsValues.status.value// 表示任务未完成(等待中)
            }
            if (!opts.total) {
                params['stage_id'] = this.props.stage.id
            }
            for (let i in values) {
                params[i] = values[i]
            }
            if (this.props.operationType === 'edit' && this.props.formFieldsValues.pid.value !== null) {
                // 更新子类保存需要特殊处理
                this.props.ajaxUpdate(this.props.formFieldsValues.id.value, params, (res) => {
                    let dataSource = []
                    this.props.dataSetting.dataSource.forEach(d => {
                        if (d.id === res.data.pid) {
                            let child = []
                            d['child'].forEach(c => {
                                if (c.id === res.data.id) {
                                    child.push(res.data)
                                } else {
                                    child.push(c)
                                }
                            })
                            d['child'] = child
                        }
                        dataSource.push(d)
                    })
                    this.props.handleSetState('dataSetting', {
                        ...this.props.dataSetting,
                        dataSource: dataSource
                    })
                    this.props.handleModalCancel()
                    message.success('保存成功')
                })
            } else {
                this.props.handleFormSubmit(params)
            }
        }

        handleStatusChange = (e) => {
            let val = e.target.value
            this.setState({
                status: val
            })
            let params = {
                page: 1,
            }
            if (!opts.total) {
                params['stage_id'] = this.props.stage.id
            }
            if (val !== 'all') {
                params['status'] = val
            }
            this.props.getData(params)
        }

        handlePidChange = (pid) => {
            if (pid) {
                this.getAllUserByTaskId(pid)
                this.getTaskDateByTaskId(pid)
            } else {
                this.getAllUser()
                this.setState({
                    taskDate: {}
                })
            }
        }

        handleDelete = (e) => {
            this.props.handleDelete(e, (res) => {
                let { dataSource } = this.props.dataSetting
                if (res.data.pid) {
                    let parentIdx = dataSource.findIndex(k => k.id === res.data.pid)
                    let parent = dataSource.find(k => k.id === res.data.pid)
                    parent['child'].splice(
                        parent['child'].findIndex(item => item.id === res.data.id),
                        1
                    )
                    dataSource[parentIdx] = parent
                } else {
                    dataSource.splice(
                        dataSource.findIndex(item => item.id === res.data.id),
                        1
                    )
                }
                this.props.handleSetState('dataSetting', {
                    ...this.props.dataSetting,
                    dataSource: dataSource
                })
            })
        }

        render() {
            const {
                route,
                history,
                location,
                match,
                stage
            } = this.props
            const state = this.state

            const operationBtn = [
                () => <Button type="primary" className="mr-10" onClick={this.add}>新增</Button>,
                () => <Button type="danger">删除</Button>,
                () => (
                    <Radio.Group className="pull-right" value={state.status} onChange={this.handleStatusChange}>
                        <Radio.Button value="all">全部</Radio.Button>
                        <Radio.Button value="0">等待中</Radio.Button>
                        <Radio.Button value="1">进行中</Radio.Button>
                        <Radio.Button value="2">已完成</Radio.Button>
                    </Radio.Group>
                )
            ]
            const popoverTableCol = [
                {
                    title: '头像',
                    dataIndex: 'avatar',
                    key: 'avatar',
                    render: (text) => <Avatar src={text ? `/uploadImgs/${text}` : ''} type="user" />
                },
                {
                    title: '姓名',
                    dataIndex: 'realname',
                    key: 'realname',
                },
                {
                    title: '实际开始时间',
                    dataIndex: 'start_date',
                    key: 'start_date',
                },
                {
                    title: '实际结束时间',
                    dataIndex: 'end_date',
                    key: 'end_date',
                },
            ]
            const columns = [
                {
                    title: '任务内容',
                    dataIndex: 'content',
                    key: 'content',
                    render: (text) => (
                        <Popover content={text}>
                            <div className="ellipsis" style={{width: 70}}>{text}</div>
                        </Popover>
                    )
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (text) => {
                        let status = {
                            '0': '等待中',
                            '1': '进行中',
                            '2': '已完成'
                        }
                        return <span>{status[text]}</span>
                    }
                },
                {
                    title: '任务计划开始时间',
                    dataIndex: 'plan_start_date',
                    key: 'plan_start_date',
                },
                {
                    title: '任务计划结束时间',
                    dataIndex: 'plan_end_date',
                    key: 'plan_end_date'
                },
                {
                    title: '执行者',
                    dataIndex: 'realname',
                    key: 'realname',
                    render: (text, record) => {
                        let users = ''
                        record.Users.forEach((user, i, arr) => {
                            users += `${user.realname}${i === (arr.length - 1) ? '' : '、'}`
                        })
                        let popoverTableData = []
                        record.Users.forEach((user, idx) => {
                            popoverTableData.push({
                                key: idx,
                                avatar: user.avatar,
                                realname: user.realname,
                                start_date: user.start_date ? user.start_date : '暂无',
                                end_date: user.end_date ? user.end_date : '暂无'
                            })
                        })
                        const Content = () => {
                            if (record.child) {
                                return <p>{users}</p>
                            } else {
                                return <Table dataSource={popoverTableData} columns={popoverTableCol} pagination={false} size="small" />
                            }
                        }
                        return (
                            <Popover content={<Content />}>
                                <div className="ellipsis" style={{width: 70}}>{users}</div>
                            </Popover>
                        )
                    }
                },
                {
                    title: '进度',
                    dataIndex: 'progress',
                    key: 'progress',
                    render: (text, record) => {
                        let percent = 0
                        if (record['child'] && record['child'].length > 0) {
                            percent = getPercent(record['child'])
                        } else {
                            percent = getPercent(record['Users'])
                        }
                        return <Progress percent={parseInt(percent)} type="circle" size="small" status="active" />
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    render: (text, record) => (
                        <span>
                            <a href="javascript:;" data-id={text.id} data-pid={text.pid} data-status={text.status} onClick={this.edit}>编辑</a>
                            <Divider type="vertical" />
                            <a href="javascript:;" data-id={text.id} onClick={this.handleDelete}>删除</a>
                        </span>
                    )
                }
            ]

            const expandedRowRender = (record, text) => {
                if (record.child) {
                    return (
                        <Table
                            columns={columns}
                            dataSource={record.child}
                            rowKey={record => record.id}
                            pagination={false}
                        />
                    )
                } else {
                    return null
                }
            }
            const rowSelection = {
                onChange: this.props.handleTableRowChange
            }

            const formFields = [
                {
                    label: '任务内容',
                    content: ({getFieldDecorator}) => {
                        return getFieldDecorator('content', {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{required: true, message: '任务内容不能为空'}]
                        })(<TextArea rows={5} placeholder="任务内容" />)
                    },
                },
                {
                    label: '从属',
                    content: ({getFieldDecorator}) => {
                        return getFieldDecorator('pid', {})(
                            <Select
                                placeholder="选择从属后变为子级任务"
                                disabled={state.taskDataDisabled}
                                onChange={this.handlePidChange}
                            >
                                <Option value={null}>无从属关系</Option>
                                {state.taskData.map(t => (
                                    <Option key={t.id} value={t.id} className="ellipsis">{t.content}</Option>
                                ))}
                            </Select>
                        )
                    },
                },
                {
                    label: '执行者',
                    content: ({getFieldDecorator}) => {
                        return getFieldDecorator('user_id', {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{required: true, message: '请选择执行者'}]
                        })(
                            <Select
                                mode="multiple"
                                placeholder="请选择执行者"
                            >
                                {state.userData.map(u => (
                                    <Option key={u.id} value={u.id}>{u.realname}</Option>
                                ))}
                            </Select>
                        )
                    },
                },
                {
                    label: '任务计划开始时间',
                    content: ({getFieldDecorator, getFieldValue}) => {
                        const disabledDate = (dateValue) => {
                            if (Object.keys(state.taskDate).length > 0) {
                                return new Date(state.taskDate.plan_start_date).getTime() > new Date(dateValue).getTime() || new Date(state.taskDate.plan_end_date).getTime() < new Date(dateValue).getTime()
                            } else {
                                return Date.now() > new Date(dateValue).getTime()
                            }
                        }
                        const validator = (rule, value, callback) => {
                            if (value) {
                                if (Object.keys(state.taskDate).length > 0) {
                                    if (
                                        new Date(dateValue).getTime() < new Date(state.taskDate.plan_start_date).getTime() ||
                                        new Date(state.taskDate.plan_end_date).getTime() < new Date(dateValue).getTime()
                                    ) {
                                        callback('计划开始时间超出父任务计划时间范围')
                                    } else {
                                        callback()
                                    }
                                } else {
                                    callback()
                                }
                            } else {
                                callback('请选择计划开始时间')
                            }
                        }
                        return getFieldDecorator('plan_start_date', {
                            rules: [{required: true, validator: validator}]
                        })(<CustomDatePicker disabledDate={disabledDate} />)
                    },
                },
                {
                    label: '任务计划结束时间',
                    content: ({getFieldDecorator, getFieldValue}) => {
                        const disabledDate = (dateValue) => {
                            if (Object.keys(state.taskDate).length > 0) {
                                return new Date(state.taskDate.plan_end_date).getTime() < new Date(dateValue).getTime() || new Date(getFieldValue('plan_start_date')).getTime() > new Date(dateValue).getTime()
                            } else {
                                if (getFieldValue('plan_start_date')) {
                                    return new Date(getFieldValue('plan_start_date')).getTime() > new Date(dateValue).getTime()
                                } else {
                                    return Date.now() > new Date(dateValue).getTime()
                                }
                            }
                        }
                        const validator = (rule, value, callback) => {
                            if (value) {
                                if (Object.keys(state.taskDate).length > 0) {
                                    if (
                                        new Date(dateValue).getTime() > new Date(state.taskDate.plan_end_date).getTime() ||
                                        new Date(dateValue).getTime() < new Date(state.taskDate.plan_start_date).getTime()
                                    ) {
                                        callback('计划开始时间超出父任务计划时间范围')
                                    } else {
                                        callback()
                                    }
                                } else {
                                    callback()
                                }
                            } else {
                                callback('请选择计划结束时间')
                            }
                        }
                        return getFieldDecorator('plan_end_date', {
                            rules: [{required: true, validator: validator}]
                        })(<CustomDatePicker disabledDate={disabledDate} />)
                    },
                },
            ]

            if (opts.total) {
                return (
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                        <BasicOperation className="mb-10 clearfix" operationBtns={operationBtn} />
                        <Table {...this.props.dataSetting} rowKey={record => record.id} columns={columns} rowSelection={rowSelection} expandedRowRender={expandedRowRender} />
                        <CustomModal {...this.props.modalSetting} footer={null} onCancel={this.props.handleModalCancel} width={660} user={this.props.user}>
                            <CustomForm
                                formStyle={{width: '100%'}}
                                formFields={formFields}
                                handleSubmit={this.handleFormSubmit}
                                updateFormFields={this.props.updateFormFields}
                                formFieldsValues={this.props.formFieldsValues}
                                isSubmitting={this.props.isSubmitting}
                            />
                        </CustomModal>
                    </div>
                )
            } else {
                return (
                    <div className="w100 mt-10">
                        <Card
                            style={{ width: '100%' }}
                            title={`${stage.name}-任务`}
                        >
                            <BasicOperation className="mb-10 clearfix" operationBtns={operationBtn} />
                            <Table {...this.props.dataSetting} rowKey={record => record.id} columns={columns} rowSelection={rowSelection} expandedRowRender={expandedRowRender} />
                            <CustomModal {...this.props.modalSetting} footer={null} onCancel={this.props.handleModalCancel} width={660} user={this.props.user}>
                                <CustomForm
                                    formStyle={{width: '100%'}}
                                    formFields={formFields}
                                    handleSubmit={this.handleFormSubmit}
                                    updateFormFields={this.props.updateFormFields}
                                    formFieldsValues={this.props.formFieldsValues}
                                    isSubmitting={this.props.isSubmitting}
                                />
                            </CustomModal>
                        </Card>
                    </div>
                )
            }
        }
    }

    const Ts = withBasicDataModel(Task, {
        model: 'task',
        title: '任务管理',
        formFieldsValues: {
            id: {
                value: null
            },
            content: {
                value: null
            },
            pid: {
                value: null
            },
            user_id: {
                value: []
            },
            plan_start_date: {
                value: null
            },
            plan_end_date: {
                value: null
            },
            status: {
                value: null
            }
        },
        clearFormValues: {
            id: {
                value: null
            },
            content: {
                value: null
            },
            pid: {
                value: null
            },
            user_id: {
                value: []
            },
            plan_start_date: {
                value: null
            },
            plan_end_date: {
                value: null
            },
            status: {
                value: null
            }
        },
        customGetData: true,
    })

    return Ts
}
