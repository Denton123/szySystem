import React from 'react'
import {List, Button, Picker, WhiteSpace, Accordion, Pagination} from 'antd-mobile'

import {ajax} from '../../../../utils/ajax'
import {parseUrlSearch, stringifyUrlSearch} from '../../../../utils/utils'

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

class TaskLists extends React.Component {
    constructor(props) {
        super(props)
        // 根据路由查询来确定是新增还是编辑
        // ?type=add
        let urlSearch = parseUrlSearch(this.props.location.search)
        this.state = {
            // 父组件传参数
            ...urlSearch,
            // 状态选择
            statusValue: ['all'], // 任务状态选取
            // 项目选择
            allProjectData: [], // 全部项目
            projectValue: null,
            // 任务数据
            taskData: [], // 记录当前类型任务数据
            pagination: {}
        }
    }
    componentWillMount() {
        let data = {
            page: this.state.page || 1
        }
        if (this.state._type === 'normal') {
            data['project_id'] = 'null'
        } else if (this.state._type === 'project') {
            data['project_id'] = 'notnull'
            this.getAllProject()
        }
        this.getData(data)
    }

    getData = (data) => {
        ajax('get', `/m/task/${this.props.user.id}/all`, data)
            .then(res => {
                this.setState({
                    taskData: res.data.data,
                    pagination: {
                        total: res.data.totalPage,
                        current: res.data.currentPage,
                        onChange: page => {
                            this.getData({
                                ...data,
                                page: page
                            })
                            let urlSearch = parseUrlSearch(this.props.location.search)
                            urlSearch['page'] = page
                            let search = stringifyUrlSearch(urlSearch)
                            this.props.history.replace(`${this.props.location.pathname}${search}`)
                        }
                    }
                })
            })
    }

    //  获取全部项目接口
    getAllProject = () => {
        ajax('get', '/m/project/all')
            .then(res => {
                let arr = []
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

    // 改变选择时的回调
    onPickerChange = (type, value) => {
        this.setState({
            [`${type}Value`]: value
        })
    }

    onDetailClick = (task) => {
        this.props.history.push(`/home/work/task/detail?_type=tDetail&task_id=${task.id}`)
    }

    search = () => {
        const {
            statusValue,
            projectValue
        } = this.state
        let data = {
            page: 1
        }
        if (statusValue[0] !== 'all') {
            data['status'] = statusValue[0]
        }
        if (this.state._type === 'normal') {
            data['project_id'] = 'null'
        } else if (this.state._type === 'project') {
            if (projectValue) {
                data['project_id'] = this.state.projectValue[0]
            } else {
                data['project_id'] = 'notnull'
            }
        }
        this.getData(data)
    }

    render() {
        const {
            _type,
            // 状态选择
            statusValue,
            // 项目选择
            projectValue,
            allProjectData,
            // 任务数据
            taskData,
            // 分页数据
            pagination,
        } = this.state
        return (
            <div>
                <List>
                    <Picker
                        data={taskStatus}
                        value={statusValue}
                        cols={1}
                        onChange={(value) => this.onPickerChange('status', value)}
                    >
                        <List.Item arrow="horizontal">状态</List.Item>
                    </Picker>
                    {this.state._type === 'project' ? (
                        <Picker
                            data={allProjectData}
                            value={projectValue}
                            cols={1}
                            onChange={(value) => this.onPickerChange('project', value)}
                        >
                            <List.Item arrow="horizontal">项目</List.Item>
                        </Picker>
                    ) : null}
                    <List.Item>
                        <Button type="primary" size="small" onClick={this.search} >查找</Button>
                    </List.Item>
                </List>
                <WhiteSpace />
                {taskData.length > 0 ? (
                    <div>
                        {taskData.map(task => (
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
                                                                <Button type="primary" size="small" inline onClick={() => this.onDetailClick(subTask)}>详情</Button>
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
                                                    <Button type="primary" size="small" inline onClick={() => this.onDetailClick(task)}>详情</Button>
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
                        ))}
                        <Pagination {...pagination} />
                    </div>
                ) : (
                    <List>
                        <List.Item>
                            暂无数据
                        </List.Item>
                    </List>
                )}
            </div>
        )
    }
}

export default TaskLists
