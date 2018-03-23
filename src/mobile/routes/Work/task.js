import React from 'react'
import { List, WhiteSpace } from 'antd-mobile'

import {ajax} from '../../../utils/ajax'

class Task extends React.Component {
    state = {
        myTask: {
            wait: 0,
            doing: 0,
            done: 0
        }
    }
    componentWillMount() {
        this.getMyTaskStatus()
    }
    getMyTaskStatus = () => {
        ajax('get', `/m/task/${this.props.user.id}/personal-status`)
            .then(res => {
                this.setState({
                    myTask: {
                        ...res.data
                    }
                })
            })
    }
    render() {
        const {
            history
        } = this.props
        const {
            myTask
        } = this.state
        return (
            <List>
                <List.Item extra={myTask.wait}>待办任务</List.Item>
                <List.Item extra={myTask.doing}>正在进行任务</List.Item>
                <List.Item extra={myTask.done}>已完成任务</List.Item>
                <WhiteSpace size="lg" />
                <List.Item arrow="horizontal" onClick={() => history.push(`/home/work/task/lists?_type=normal`)}>
                    普通任务
                </List.Item>
                <List.Item arrow="horizontal" onClick={() => history.push(`/home/work/task/lists?_type=project`)}>
                    项目任务
                </List.Item>
            </List>
        )
    }
}

export default Task
