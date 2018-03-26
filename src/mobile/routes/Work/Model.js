import React from 'react'
import {
    Link,
} from 'react-router-dom'

function getRoutes(path) {
    let route = ''
    for (let i of path) {
        route += `/${i}`
    }
    return require(`.${route}`).default
}

const names = {
    attendance: '考勤',
    worklog: '工作日志',
    summary: '每周总结',
    task: '我的任务',
}

class Model extends React.Component {
    componentWillMount() {
        this.props.setCustomNavBarState(names[this.props.match.params.model], 'back')
    }
    render() {
        const {
            match,
        } = this.props
        const Content = getRoutes([match.params.model])
        return (
            <Content {...this.props} />
        )
    }
}

export default Model
