import React from 'react'
import ReactDOM from 'react-dom'
import { List, Picker, WhiteSpace, Accordion } from 'antd-mobile'
import withBasicDataModel from '../withBasicDataModel'
import CompanyDetailPageModel from '../CompanyDetailPageModel'
import NoData from '../NoData'
import { ajax } from 'UTILS/ajax'

const taskStatus = [
    {
        label: '全部',
        value: 'all'
    },
    {
        label: '等待中',
        value: '0'
    },
    {
        label: '进行中',
        value: '1'
    },
    {
        label: '已完成',
        value: '2'
    },
    {
        label: '超时',
        value: '3'
    },
]

const locale = {
    prevText: 'Prev',
    nextText: 'Next'
}

module.exports = function(opts) {
    class Task extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                // getData方法的参数
                params: {
                    state: {}, // getData第2个参数
                    filter: ['status'] // getData第3个参数
                },
                // 类型：普通任务/项目任务
                _type: opts._type,
                // 项目选择
                allProjectData: [
                    {
                        label: '请选择',
                        value: opts._type === 'normal' ? 'null' : 'notnull'
                    }
                ], // 全部项目
                projectValue: null,
                // 重置表单不需要过滤的字段（针对重置表单字段）
                resetNotFilter: opts.resetNotFilter ? opts.resetNotFilter : undefined,
                // 存储过滤参数
                filter: ['status']
            }
        }

        componentWillMount() {
            let id = false
            if (this.props.match.params && this.props.match.params.id) {
                id = this.props.match.params.id
                // console.log(111111)
                // this.props.history.replace(`${this.props.location.pathname}`, {...this.props.location.state, project_id: id})
                // this.props.history.replace(this.props.location.pathname, {...this.props.location.state, project_id: id})
            }
            if (opts.hasProjectSelect) {
                //  获取全部项目接口
                this.getAllProject()
            }

            // 根据项目id来请求的
            let projectId
            if (id) {
                projectId = id
            } else { // 不是根据项目id来请求的，是直接请求所有的普通任务或者项目任务
                if (this.state._type === 'normal') {
                    projectId = 'null'
                } else if (this.state._type === 'project') {
                    projectId = 'notnull'
                }
            }
            this.setState(() => {
                return {
                    params: {
                        ...this.state.params,
                        state: {project_id: projectId}
                    }
                }
            })
        }

        // 下拉选择
        handleOk = (type, e) => {
            let resetFilterArr = []
            if (type === 'status') {
                if (e[0] === 'all') {
                    resetFilterArr.push('status')
                } else {
                    resetFilterArr = []
                }
                this.setState(() => {
                    return {
                        filter: resetFilterArr
                    }
                })
            }
        }

        handleSetTaskState = (stateFields, stateValue, cb) => {
            this.setState({
                [stateFields]: stateValue
            }, () => {
                if (cb) {
                    cb()
                }
            })
        }

        //  获取全部项目接口
        getAllProject = () => {
            ajax('get', '/m/project/all')
                .then(res => {
                    let arr = this.state.allProjectData
                    res.data.forEach(d => {
                        arr.push({
                            label: d.name,
                            value: d.id
                        })
                    })
                    this.setState({
                        allProjectData: arr
                    })
                })
        }

        render() {
            const {
                route,
                history,
                location,
                match,
                permissionRoutes,
                dateSetting
            } = this.props
            const {
                _type,
                // 项目选择
                projectValue,
                allProjectData,
                params,
                resetNotFilter,
                filter
            } = this.state

            // 条件
            let condition = [
                ({getFieldProps}) => {
                    return (
                        <Picker extra="请选择(可选)"
                            data={taskStatus}
                            title="状态"
                            {...getFieldProps('status', {
                                initialValue: ['all']
                            })}
                            cols={1}
                            onOk={e => this.handleOk('status', e)}
                        >
                            <List.Item arrow="horizontal">状态</List.Item>
                        </Picker>
                    )
                }
            ]

            if (opts.hasProjectSelect) {
                condition.push(({getFieldProps}) => {
                    return (
                        <Picker extra="请选择(可选)"
                            data={allProjectData}
                            title="项目"
                            {...getFieldProps('project_id', {
                                initialValue: [allProjectData[0].value]
                            })}
                            cols={1}
                            onOk={e => this.handleOk('project', e)}
                        >
                            <List.Item arrow="horizontal">项目</List.Item>
                        </Picker>
                    )
                })
            }

            return (
                <div>
                    <CompanyDetailPageModel
                        {...this.props}
                        condition={condition}
                        params={params}
                        resetNotFilter={resetNotFilter}
                        type={_type}
                        filter={filter}
                        handleSetTaskState={this.handleSetTaskState}>
                        {
                            (dateSetting.dataSource && dateSetting.dataSource.length > 0) ? dateSetting.dataSource.map((task, i) => (
                                <div key={task.id}>
                                    <List>
                                        {task.child && task.child.length > 0 ? (
                                            <Accordion key={task.id}>
                                                <Accordion.Panel header={
                                                    <div className="txt-l">{_type === 'project' ? `${task.Project.name}-${task.content}` : `${task.content}`}</div>
                                                }>
                                                    {task.child.map(subTask => (
                                                        <List.Item
                                                            key={subTask.id}
                                                            extra={
                                                                <div>
                                                                    <div>{taskStatus.find(t => t.value === subTask.status).label}</div>
                                                                </div>
                                                            }
                                                            multipleLine
                                                        >
                                                            {task.content}
                                                            <List.Item.Brief>
                                                                {subTask.content}
                                                            </List.Item.Brief>
                                                        </List.Item>
                                                    ))}
                                                </Accordion.Panel>
                                            </Accordion>
                                        ) : (
                                            <List.Item
                                                extra={
                                                    <div>
                                                        <div>{taskStatus.find(t => t.value === task.status).label}</div>
                                                    </div>
                                                }
                                                multipleLine
                                            >
                                                {_type === 'project' ? (
                                                    <div>
                                                        {task.Project.name}
                                                        <List.Item.Brief>
                                                            {task.content}
                                                        </List.Item.Brief>
                                                    </div>
                                                ) : (
                                                    <div>{task.content}</div>
                                                )}
                                            </List.Item>
                                        )}
                                    </List>
                                    <WhiteSpace />
                                </div>
                            )) : <NoData />
                        }
                    </CompanyDetailPageModel>
                </div>
            )
        }
    }

    const T = withBasicDataModel(Task, {
        model: 'task'
    })
    return T
}
