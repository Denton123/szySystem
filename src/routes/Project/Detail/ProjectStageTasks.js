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

class ProjectStageTasks extends React.Component {
    state = {
        // 默认显示全部任务
        status: 'all',
        // 全部用户信息
        userData: [],
        // 全部父级任务
        taskData: [],
        // 选择父级是否可用
        taskDataDisabled: false,
    }

    componentDidMount() {
        let page = this.props.location.state ? this.props.location.state.page : 1
        let sid = this.props.stage.id
        this.props.getData({
            page: page,
            stage_id: sid
        })
    }

    componentWillReceiveProps(nextProps) {
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

    getAllUser = () => {
        ajax('get', '/user/all')
            .then(res => {
                this.setState({
                    userData: res.data
                })
            })
    }

    getAllParentsTask = () => {
        ajax('get', '/task/all-parents', {params: {stage_id: this.props.stage.id}})
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
        this.getAllParentsTask()
        this.props.handleAdd(e)
    }

    edit = (e) => {
        if (this.state.userData.length === 0) {
            this.getAllUser()
        }
        this.getAllParentsTask()
        this.props.handleEdit(e)
    }

    handleFormSubmit = (values) => {
        let params = {
            status: this.props.operationType === 'add' ? '0' : this.props.formFieldsValues.status.value, // 表示任务未完成(等待中)
            stage_id: this.props.stage.id
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
            stage_id: this.props.stage.id
        }
        if (val !== 'all') {
            params['status'] = val
        }
        this.props.getData(params)
    }

    render() {
        const {
            match,
            location,
            history,
            stage
        } = this.props

        console.log(this.props.location)

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
                    const Content = () => (
                        <Table dataSource={popoverTableData} columns={popoverTableCol} pagination={false} size="small" />
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
            <div className="w100 mt-10">
                <Card
                    style={{ width: '100%' }}
                    title={`${stage.name}-任务`}
                >
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
                </Card>
            </div>
        )
    }
}

const PST = withBasicDataModel(ProjectStageTasks, {
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

export default PST
