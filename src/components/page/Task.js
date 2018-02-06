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
} from 'react-router-dom'

// 引入工具方法
import {isObject, isArray, valueToMoment, momentToValue, resetObject, getTime, formatDate} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomRangePicker from 'COMPONENTS/date/CustomRangePicker'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'
// 自定义弹窗
import CustomPrompt from 'COMPONENTS/modal/CustomPrompt'

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
    if (isNaN(percent)) {
        percent = 0
    }
    return percent
}

module.exports = function(opts) {
    class Task extends React.Component {
        state = {
            // 默认显示全部任务
            status: this.props.location.state && this.props.location.state.status ? this.props.location.state.status : 'all',
            // 全部用户信息
            allUserData: [],
            // 新增或者编辑任务时，可选的执行者
            userData: [],
            // 默认的项目值
            defaultProject: undefined,
            // 全部项目信息
            projectData: [],
            // 全部父级任务
            taskData: [],
            // 选择父级是否禁用
            taskDataDisabled: false,
            // 父任务的计划开始时间和计划结束时间
            taskDate: {},
        }

        componentDidMount() {
            console.log('任务管理 ----- ')
            console.log(this.props)
            let data = this.props.location.state && this.props.location.state.page ? this.props.location.state : {page: 1}
            // let page = this.props.location.state ? this.props.location.state.page : 1
            if (opts.total) { // 任务管理页面
                if (opts.hasProject) { // 项目任务
                    this.props.getData({...data, project_id: 'notnull', __key: 'project'})
                    this.getAllProject()
                } else { // 普通任务
                    this.props.getData({...data, project_id: 'null', __key: 'normal'})
                }
            }
            this.getAllUser()
        }

        componentWillReceiveProps(nextProps) {
            if (!opts.total) { // 项目详情页获取的任务
                if (nextProps.project.id !== this.props.project.id) {
                    let data = this.props.location.state && this.props.location.state.page ? this.props.location.state : {page: 1}
                    // let page = this.props.location.state ? this.props.location.state.page : 1
                    // this.setState({
                    //     status: 'all'
                    // })
                    this.props.getData({
                        ...data,
                        project_id: nextProps.project.id
                    })
                }
            }
        }

        getAllProject = () => {
            ajax('get', '/project/all')
                .then(res => {
                    this.setState({
                        projectData: res.data
                    })
                })
        }

        getAllUser = () => {
            if (this.state.allUserData.length > 0) {
                this.setState({
                    userData: this.state.allUserData
                })
            } else {
                ajax('get', '/user/all')
                    .then(res => {
                        this.setState({
                            allUserData: res.data,
                            userData: res.data
                        })
                    })
            }
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
                ? ajax('get', '/task/all-parents', {project_id: 'null'})
                : ajax('get', '/task/all-parents', {project_id: this.props.project.id})
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
            console.log('edit---')
            // if (e.target.dataset['status'] !== '0') {
            //     message.warning('任务已经开始、完成或者超时！')
            //     return
            // }
            // ==>
            if (e.target.dataset['status'] === '2') {
                message.warning('任务已经完成！')
                return
            }
            if (this.props.project) { // 在项目中的任务，如果项目的计划时间结束。任务也将不能编辑
                if (getTime(formatDate()) > getTime(this.props.project.plan_end_date)) {
                    message.warning('项目已经过期')
                    return
                }
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
            this.props.handleEdit(e, (res) => {
                this.props.handleSetState('modalSetting', {
                    ...this.props.modalSetting,
                    visible: true,
                    title: `${this.props.title}-编辑`
                })
                let data = resetObject(res.data)
                data['plan_date'] = [data['plan_start_date'], data['plan_end_date']]
                this.props.updateEditFormFieldsValues(data)
            })
        }

        goBack = (e) => {
            let id = e.target.dataset['id']
            ajax('get', `/task/${id}/update-status`)
                .then(res => {
                    if (res.data) {
                        let dataSource = []
                        this.props.dataSetting.dataSource.forEach(d => {
                            if (d.id === res.data.data[0].id) {
                                dataSource.push(res.data.data[0])
                            } else {
                                dataSource.push(d)
                            }
                        })
                        this.props.handleSetState('dataSetting', {
                            ...this.props.dataSetting,
                            dataSource: dataSource
                        })
                        message.success('后退成功')
                    }
                })
                .catch(() => {
                    message.error('后退失败')
                })
        }

        handleFormSubmit = (values) => {
            let params = {
                status: this.props.operationType === 'add' ? '0' : this.props.formFieldsValues.status.value, // 表示任务未完成(等待中)
                uid: this.props.user.id
            }
            if (!opts.total) {
                params['project_id'] = this.props.project.id
            } else {
                if (!opts.hasProject) {
                    params['project_id'] = 'null'
                }
            }
            for (let i in values) {
                if (i.indexOf('date') > -1) continue
                params[i] = values[i]
            }
            params['plan_start_date'] = values['plan_date'][0].format('YYYY-MM-DD')
            params['plan_end_date'] = values['plan_date'][1].format('YYYY-MM-DD')
            if (this.props.operationType === 'edit' && this.props.formFieldsValues.pid.value !== null) {
                // 更新子类保存需要特殊处理
                this.props.ajaxUpdate(this.props.formFieldsValues.id.value, params, (res) => {
                    if (res.data.id === this.props.formFieldsValues.id.value) {
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
                    } else {
                        message.error('保存失败')
                        this.props.handleSetState('isSubmitting', false)
                    }
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
                ...this.props.location.state,
                page: 1
            }
            if (opts.hasProject) {
                if (this.state.defaultProject) {
                    params['project_id'] = this.state.defaultProject
                } else {
                    params['project_id'] = 'notnull'
                }
            } else {
                params['project_id'] = 'null'
            }
            if (!opts.total) {
                params['project_id'] = this.props.project.id
            }
            params['status'] = val
            if (params['status'] === 'all') { // 选择全部任务的时候，把参数中的status删除
                delete params['status']
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
            e.persist()
            this.props.handleDelete(e, (res) => {
                if (parseInt(res.data.id) === parseInt(e.target.dataset['id'])) {
                    let { dataSource } = this.props.dataSetting
                    // if (res.data.pid) { // 返回的数据是子任务
                    //     let parentIdx = dataSource.findIndex(k => k.id === res.data.pid)
                    //     let parent = dataSource.find(k => k.id === res.data.pid)
                    //     parent['child'].splice(
                    //         parent['child'].findIndex(item => item.id === res.data.id),
                    //         1
                    //     )
                    //     dataSource[parentIdx] = parent
                    // } else { // 返回的数据是父任务
                    //     dataSource.splice(
                    //         dataSource.findIndex(item => item.id === res.data.id),
                    //         1
                    //     )
                    // }
                    // if (dataSource.length === 0 && this.props.location.state.page > 1) { // 当前最后一条数据被删除后，默认请求第一页数据
                    //     this.props.getData({
                    //         ...this.props.location.state,
                    //         page: 1
                    //     })
                    // } else {
                    //     this.props.handleSetState('dataSetting', {
                    //         ...this.props.dataSetting,
                    //         dataSource: dataSource
                    //     })
                    // }
                    let statePage = this.props.location.state.page
                    if (dataSource.length === 1 && statePage > 1) {
                        statePage -= 1
                    }
                    this.props.getData({...this.props.location.state, page: statePage})
                    message.success('删除成功')
                } else {
                    message.error('删除失败')
                }
            })
        }

        projectChange = (id) => {
            this.setState({
                defaultProject: id
            })
            if (!id) {
                id = 'notnull'
            }
            let data = {
                ...this.props.location.state,
                page: 1,
                project_id: id,
            }
            this.props.getData(data)
        }

        render() {
            const {
                route,
                history,
                location,
                match
            } = this.props
            const state = this.state

            let operationBtn = [
                () => (
                    <Radio.Group className="pull-right" value={state.status} onChange={this.handleStatusChange}>
                        <Radio.Button value="all">全部</Radio.Button>
                        <Radio.Button value="0">等待中</Radio.Button>
                        <Radio.Button value="1">进行中</Radio.Button>
                        <Radio.Button value="2">已完成</Radio.Button>
                        <Radio.Button value="3">超时</Radio.Button>
                    </Radio.Group>
                ),
            ]
            if (!opts.hasProject) {
                operationBtn.unshift(() => <Button type="danger" onClick={this.props.handleBatchDelete}>删除</Button>)
                if (opts.total) {
                    operationBtn.unshift(() => <Button type="primary" className="mr-10" onClick={this.add}>新增</Button>)
                } else {
                    let temp = getTime(formatDate()) > getTime(this.props.project.plan_end_date)
                    operationBtn.unshift(() => <Button type="primary" className="mr-10" disabled={temp} onClick={this.add}>新增</Button>)
                }
            } else {
                operationBtn.unshift(() => (
                    <Select
                        style={{width: 120}}
                        className="pull-left"
                        placeholder="请选择项目"
                        allowClear
                        value={state.defaultProject}
                        onChange={this.projectChange}
                    >
                        {state.projectData.map((pro) => (
                            <Option value={pro.id} key={pro.id}>{pro.name}</Option>
                        ))}
                    </Select>
                ))
            }

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
                    render: (text, record) => {
                        if (text === '暂无' && record.status === '3') {
                            return (<span>{超时}</span>)
                        } else {
                            return (<span>{text}</span>)
                        }
                    }
                },
                {
                    title: '实际结束时间',
                    dataIndex: 'end_date',
                    key: 'end_date',
                    render: (text, record) => {
                        if (text === '暂无' && record.status === '3') {
                            return (<span>{超时}</span>)
                        } else {
                            return (<span>{text}</span>)
                        }
                    }
                },
            ]
            let columns = [
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
                            '2': '已完成',
                            '3': '超时'
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
                    title: '发布者',
                    dataIndex: 'uid',
                    key: 'uid',
                    render: (text) => (
                        <span>{state.allUserData.find(u => u.id === text) && state.allUserData.find(u => u.id === text).realname}</span>
                    )
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
                        if (users === '') {
                            users = '暂无执行者'
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
                        let status
                        if (record.status === '0' || record.status === '1') {
                            status = 'active'
                        }
                        if (record.status === '2') {
                            status = 'success'
                        }
                        if (record.status === '3') {
                            status = 'exception'
                        }
                        return <Progress percent={parseInt(percent)} type="circle" size="small" status={status} />
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    render: (text, record) => {
                        if (opts.hasProject) {
                            return <Link to={`/home/project/info/${record.Project.id}`}>查看</Link>
                        } else {
                            return (
                                <span>
                                    {
                                        text.uid === this.props.user.id &&
                                        (text.status === '2' ? (
                                            text.child ? (
                                                <span>
                                                    <a href="javascript:;" data-id={text.id} onClick={this.handleDelete}>删除</a>
                                                </span>
                                            ) : (
                                                <span>
                                                    <a data-id={text.id} data-pid={text.pid} data-status={text.status} onClick={this.goBack}>回退</a>
                                                    <Divider type="vertical" />
                                                    <a href="javascript:;" data-id={text.id} onClick={this.handleDelete}>删除</a>
                                                </span>
                                            )
                                        ) : (
                                            <span>
                                                <a href="javascript:;" data-id={text.id} data-pid={text.pid} data-status={text.status} onClick={this.edit}>编辑</a>
                                                <Divider type="vertical" />
                                                <a href="javascript:;" data-id={text.id} onClick={this.handleDelete}>删除</a>
                                            </span>
                                        ))
                                    }
                                </span>
                            )
                        }
                    }
                }
            ]

            if (opts.total && opts.hasProject) {
                columns.unshift({
                    title: '所属项目',
                    dataIndex: 'projectname',
                    key: 'projectname',
                    render: (text, record) => (
                        <span>{record.Project.name}</span>
                    )
                })
            }

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
                            rules: [{required: true, message: '任务内容不能为空'}]
                        })(<TextArea rows={5} placeholder="任务内容" />)
                    },
                },
                {
                    label: '从属',
                    content: ({getFieldDecorator, getFieldValue, setFields}) => {
                        const pidChange = () => {
                            if (getFieldValue('pid') !== null) {
                                setFields({
                                    plan_date: {
                                        value: null,
                                        errors: [new Error('请选择计划时间')],
                                    },
                                    user_id: {
                                        value: [],
                                        errors: [new Error('请选择执行者')],
                                    }
                                })
                            }
                        }
                        return getFieldDecorator('pid')(
                            <Select
                                placeholder="选择从属后变为子级任务"
                                disabled={state.taskDataDisabled}
                                onChange={this.handlePidChange}
                                onBlur={pidChange}
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
                    label: '任务计划时间',
                    content: ({getFieldDecorator, getFieldValue}) => {
                        const disabledDate = (start, end) => {
                            let startDate = start.format('YYYY-MM-DD')
                            let endDate = end.format('YYYY-MM-DD')
                            if (getFieldValue('pid') !== null) { // 判断是否为子任务，子任务的时间区间在父任务中
                                return getTime(startDate) < getTime(state.taskDate.plan_start_date) ||
                                    getTime(startDate) > getTime(state.taskDate.plan_end_date)
                            } else {
                                if (this.props.project) { // 判断是否为项目父任务
                                    return getTime(startDate) < getTime(this.props.project.plan_start_date) ||
                                        getTime(startDate) > getTime(this.props.project.plan_end_date)
                                } else { // 普通情况的父任务
                                    return getTime(startDate) < getTime()
                                }
                            }
                        }
                        return getFieldDecorator('plan_date', {
                            rules: [{required: true, message: '请选择计划时间'}]
                        })(<CustomRangePicker showTime={false} format={'YYYY-MM-DD'} disabledDate={disabledDate} />)
                    },
                },
            ]

            if (opts.total) {
                return (
                    <div>
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
            plan_date: {
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
            plan_date: {
                value: null
            },
            status: {
                value: null
            }
        },
        customGetData: true,
        locationSearch: false
    })

    return Ts
}
