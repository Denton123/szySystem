import React, {Component} from 'react'
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

// 自定义弹窗
import CustomPrompt from 'COMPONENTS/modal/CustomPrompt'
import CustomRangePicker from 'COMPONENTS/date/CustomRangePicker'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import CustomModal from 'COMPONENTS/modal/CustomModal'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

const {TextArea} = Input
const {Option} = Select

module.exports = function(opts) {
    class MyMission extends Component {
        state = {
            // 默认显示全部任务
            status: 'all',
            // 默认的任务
            defaultProject: undefined,
            // 全部项目数据
            projectData: []
        }

        componentDidMount() {
            console.log('--------')
            console.log(this.props.location)
            let data = this.props.location.state && this.props.location.state.page ? this.props.location.state : {page: 1}
            console.log(data)
            // let obj = Object.assign({}, this.props.queryFieldValues)
            // Object.keys(this.props.queryFieldValues).forEach(field => {
            //     if (data.hasOwnProperty(field)) {
            //         obj[field] = {
            //             value: transformValue(field, data[field])
            //         }
            //     }
            // })

            // let page = this.props.location.state ? this.props.location.state.page : 1
            // let data = {
            //     page: page
            // }
            if (opts.hasProject) {
                data['project_id'] = 'notnull'
            } else {
                data['project_id'] = 'null'
            }
            this.props.getData(
                data,
                (params) => ajax('get', `/task/${this.props.user.id}/all`, params)
            )
            this.props.getMyTaskStatus()
            if (opts.hasProject) {
                this.getAllProject()
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

        handleStatusChange = (e) => {
            let val = e.target.value
            this.setState({
                status: val
            })
            let data = this.props.location.state && this.props.location.state.page ? this.props.location.state : {page: 1}
            if (val !== 'all') {
                data['status'] = val
            }
            if (opts.hasProject) {
                data['project_id'] = 'notnull'
                this.setState({
                    defaultProject: undefined
                })
            } else {
                data['project_id'] = 'null'
            }
            this.props.getData(
                data,
                (params) => ajax('get', `/task/${this.props.user.id}/all`, params)
            )
        }

        handleTaskStatus = (e) => {
            let tid = e.target.dataset['tid']
            let status = e.target.dataset['status']
            CustomPrompt({
                type: 'confirm',
                content: <div>{`是否${status === '1' ? '开始任务' : '完成任务'}`}</div>,
                okType: 'info',
                onOk: () => {
                    this.props.handleSetState('isSubmitting', true)
                    ajax('put', `/task/${tid}/user/${this.props.user.id}/status`, {status: status})
                        .then(res => {
                            if (res.data.errors) {
                                message.error(res.data.errors.message)
                            } else {
                                let dataSource = []
                                this.props.dataSetting.dataSource.forEach(ds => {
                                    if (ds.id === res.data.id) {
                                        dataSource.push(res.data)
                                    } else {
                                        dataSource.push(ds)
                                    }
                                })
                                this.props.handleSetState('dataSetting', {
                                    ...this.props.dataSetting,
                                    dataSource: dataSource
                                })
                                this.props.handleSetState('isSubmitting', false)
                                message.success('保存成功')
                                this.props.getMyTaskStatus()
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            this.props.handleSetState('isSubmitting', false)
                            message.error('保存失败')
                        })
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
            this.setState({
                status: 'all'
            })
            let data = this.props.location.state && this.props.location.state.page ? this.props.location.state : {page: 1}
            // let page = this.props.location.state ? this.props.location.state.page : 1
            data = {
                project_id: id,
                ...data
            }
            this.props.getData(
                data,
                (params) => ajax('get', `/task/${this.props.user.id}/all`, params)
            )
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
                )
            ]

            if (opts.hasProject) {
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
                    title: '实际开始时间',
                    dataIndex: 'start_date',
                    key: 'start_date',
                    render: (text, record) => (
                        <span>{record['Users'][0]['start_date']}</span>
                    )
                },
                {
                    title: '实际结束时间',
                    dataIndex: 'end_date',
                    key: 'end_date',
                    render: (text, record) => (
                        <span>{record['Users'][0]['end_date']}</span>
                    )
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) => {
                        if (record['child']) {
                            if (record['child'].length > 0) {
                                return `点击左侧查看子任务`
                            } else {
                                return `暂无任务分配`
                            }
                        }
                        let status = record['Users'][0]['status']
                        const Start = () => <Button type="primary" loading={this.props.isSubmitting} data-tid={record.id} data-status="1" onClick={this.handleTaskStatus}>开始任务</Button>
                        const Waiting = () => <Button type="primary" loading={this.props.isSubmitting} data-tid={record.id} data-status="2" onClick={this.handleTaskStatus}>完成任务</Button>
                        let Action
                        switch (status) {
                            case '0':
                                Action = () => (<Start />)
                                break
                            case '1':
                                Action = () => (<Waiting />)
                                break
                            case '2':
                                Action = () => (<span>已完成</span>)
                                break
                            case '3':
                                Action = () => (<span>超时</span>)
                                break
                        }
                        return (<Action />)
                    }
                }
            ]

            if (opts.hasProject) {
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

            return (
                <div>
                    <BasicOperation className="mb-10 clearfix" operationBtns={operationBtn} />
                    <Table {...this.props.dataSetting} rowKey={record => record.id} columns={columns} expandedRowRender={expandedRowRender} />
                </div>
            )
        }
    }

    const MM = withBasicDataModel(MyMission, {
        model: 'task',
        title: '任务管理',
        customGetData: true,
    })

    return MM
}
