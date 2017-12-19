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
    Card
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import './Task.less'

// 引入工具方法
import {isObject, isArray, valueToMoment, momentToValue, resetObject} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomRangePicker from 'COMPONENTS/date/CustomRangePicker'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'
import CustomDynamicForm from 'COMPONENTS/form/CustomDynamicForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

const { TextArea } = Input
const {Option} = Select

class Task extends React.Component {
    state = {
        // 默认显示全部任务
        status: 'all',
        // 全部用户信息
        userData: [],
        // 全部父级任务
        taskData: [],
        // 选择父级是否可用
        taskDataDisabled: false
    }

    getAllUser = () => {
        ajax('get', '/user/all')
            .then(res => {
                this.setState({
                    userData: res.data
                })
            })
    }

    getAllParentsTask = () => {
        ajax('get', '/task/all-parents')
            .then(res => {
                this.setState({
                    taskData: res.data
                })
            })
    }

    add = (e) => {
        if (this.state.userData.length === 0) {
            this.getAllUser()
        }
        if (this.state.taskData.length === 0) {
            this.getAllParentsTask()
        }
        this.props.handleAdd(e)
    }

    edit = (e) => {
        if (this.state.userData.length === 0) {
            this.getAllUser()
        }
        if (this.state.taskData.length === 0) {
            this.getAllParentsTask()
        }
        this.props.handleEdit(e)
    }

    handleFormSubmit = (values) => {
        console.log('task submit values', values)
        console.log('formFieldsValues', this.props.formFieldsValues)
        let params = {
            status: this.props.operationType === 'add' ? '0' : this.props.formFieldsValues.status.value// 表示任务未完成(等待中)
        }
        for (let i in values) {
            params[i] = values[i]
        }
        if (this.props.operationType === 'edit' && this.props.formFieldsValues.pid.value !== null) {
            // 更新子类保存
        } else {
            this.props.handleFormSubmit(params)
        }
    }

    handleStatusChange = (e) => {
        let val = e.target.value
        this.setState({
            status: val
        })
        if (val === 'all') {
            this.props.getData({page: 1})
        } else {
            let params = {
                page: 1,
                status: val
            }
            this.props.getData(params)
        }
    }

    render() {
        const {
            route,
            history,
            location,
            match
        } = this.props
        const state = this.state

        const operationBtn = [
            () => <Button type="primary" className="mr-10" onClick={this.add}>新增</Button>,
            () => <Button type="danger" onClick={this.props.handleDelete}>删除</Button>,
            () => (
                <Radio.Group className="pull-right" value={state.status} onChange={this.handleStatusChange}>
                    <Radio.Button value="all">全部</Radio.Button>
                    <Radio.Button value="0">等待中</Radio.Button>
                    <Radio.Button value="1">进行中</Radio.Button>
                    <Radio.Button value="2">已完成</Radio.Button>
                </Radio.Group>
            )
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
            // {
            //     title: '实际开始时间',
            //     dataIndex: 'start_date',
            //     key: 'start_date'
            // },
            // {
            //     title: '实际结束时间',
            //     dataIndex: 'end_date',
            //     key: 'end_date'
            // },
            {
                title: '执行者',
                dataIndex: 'realname',
                key: 'realname',
                render: (text, record) => {
                    let users = ''
                    record.Users.forEach((user, i, arr) => {
                        users += `${user.realname}${i === (arr.length - 1) ? '' : '、'}`
                    })
                    const Content = () => (
                        <Card>
                            {record.Users.map((user, idx) => (
                                <div className="task-popover" key={idx}>
                                    <Avatar src={user.avatar} />
                                    <span className="ml-10 mr-10">{user.realname}</span>
                                    <span className="mr-10">开始时间：{user.start_date ? user.start_date : '暂无' }</span>
                                    <span className="mr-10">结束时间：{user.start_date ? user.start_date : '暂无' }</span>
                                </div>
                            ))}
                        </Card>
                    )
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
                render: text => <Progress percent={50} size="small" status="active" />
            },
            {
                title: '操作',
                key: 'action',
                width: 200,
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" data-id={text.id} onClick={this.edit}>编辑</a>
                        <Divider type="vertical" />
                        <a href="javascript:;" data-id={text.id} onClick={this.props.handleDelete}>删除</a>
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
                field: 'content',
                valid: {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{required: true, message: '任务内容不能为空'}]
                },
                component: (<TextArea rows={5} placeholder="任务内容" />),
            },
            {
                label: '从属',
                field: 'pid',
                component: (
                    <Select
                        placeholder="请选择执行者"
                        disabled={state.taskDataDisabled}
                    >
                        {state.taskData.map(t => (
                            <Option key={t.id} value={t.id} className="ellipsis">{t.content}</Option>
                        ))}
                    </Select>
                ),
            },
            {
                label: '执行者',
                field: 'user_id',
                valid: {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{required: true, message: '请选择执行者'}]
                },
                component: (
                    <Select
                        mode="multiple"
                        placeholder="请选择执行者"
                        onChange={this.handleChange}
                    >
                        {state.userData.map(u => (
                            <Option key={u.id} value={u.id}>{u.realname}</Option>
                        ))}
                    </Select>
                ),
            },
            {
                label: '任务计划开始时间',
                field: 'plan_start_date',
                valid: {
                    rules: [{required: true, message: '请选择计划开始时间'}]
                },
                component: <CustomDatePicker format="YYYY-MM-DD" showTime={false} />,
            },
            {
                label: '任务计划结束时间',
                field: 'plan_end_date',
                valid: {
                    rules: [{required: true, message: '请选择计划结束时间'}]
                },
                component: <CustomDatePicker format="YYYY-MM-DD" showTime={false} />,
            },
        ]

        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <BasicOperation className="mb-10 clearfix" operationBtns={operationBtn} />
                <Table {...this.props.dataSetting} rowKey={record => record.id} columns={columns} rowSelection={rowSelection} expandedRowRender={expandedRowRender} />
                <CustomModal {...this.props.modalSetting} footer={null} onCancel={this.props.handleModalCancel} width={660}>
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
})

export default Ts
