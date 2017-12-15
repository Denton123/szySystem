import React from 'react'
import {
    Button,
    Radio,
    Table,
    Progress,
    Divider,
    Select,
    Input
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

// 引入工具方法
import {isObject, isArray, valueToMoment, momentToValue} from 'UTILS/utils'
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
        taskData: []
    }

    add = (e) => {
        if (this.state.userData.length === 0) {
            ajax('get', '/user/all')
                .then(res => {
                    this.setState({
                        userData: res.data
                    })
                })
        }
        ajax('get', '/task/all-parents')
            .then(res => {
                this.setState({
                    taskData: res.data
                })
            })
        this.props.handleAdd(e)
    }

    handleFormSubmit = (values) => {
        let data = {
            status: '0'// 表示任务未完成(等待中)
        }
        for (let i in values) {
            data[i] = values[i]
        }
        console.log(data)
        this.props.handleFormSubmit(data)
    }

    handleStatusChange = (e) => {
        this.setState({
            status: e.target.value
        })
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
                render: text => <div className="ellipsis">超出10个字就隐藏掉sssss</div>
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
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
                title: '实际开始时间',
                dataIndex: 'start_date',
                key: 'start_date'
            },
            {
                title: '实际结束时间',
                dataIndex: 'end_date',
                key: 'end_date'
            },
            {
                title: '执行者',
                dataIndex: 'users',
                key: 'users',
                render: text => (<p>{text}</p>)
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
                        <a href="javascript:;" data-id={text.id} onClick={this.props.handleEdit}>编辑</a>
                        <Divider type="vertical" />
                        <a href="javascript:;" data-id={text.id} onClick={this.props.handleDelete}>删除</a>
                    </span>
                )
            }
        ]
        const rowSelection = {
            onChange: this.props.handleTableRowChange
        }
        const tableExpandedRowRender = (record) => {
            return (
                <div>
                    {这里应该不单单显示}
                </div>
            )
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
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{required: true, message: '请选择计划开始时间'}]
                },
                component: <CustomDatePicker format="YYYY-MM-DD" showTime={false} />,
            },
            {
                label: '任务计划结束时间',
                field: 'plan_end_date',
                valid: {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{required: true, message: '请选择计划结束时间'}]
                },
                component: <CustomDatePicker format="YYYY-MM-DD" showTime={false} />,
            },
        ]

        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <BasicOperation className="mb-10 clearfix" operationBtns={operationBtn} />
                <Table {...this.props.tableSetting} rowKey={record => record.id} columns={columns} rowSelection={rowSelection} expandedRowRender={tableExpandedRowRender} />
                <CustomModal {...this.props.modalSetting} footer={null} onCancel={this.props.handleModalCancel} width={660}>
                    <CustomForm
                        formStyle={{width: '100%'}}
                        formFields={formFields}
                        handleSubmit={this.props.handleFormSubmit}
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
        }
    },
    clearFormValues: {
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
        }
    }
})

export default Ts
