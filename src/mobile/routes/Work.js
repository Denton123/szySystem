import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    Link,
} from 'react-router-dom'
import { List } from 'antd-mobile'

class Work extends React.Component {
    componentWillMount() {
        this.props.setCustomNavBarState(this.props.route.name, 'menu')
    }
    render() {
        const {
            match,
            history
        } = this.props
        const ListData = [
            {
                name: '考勤',
                url: '/attendance'
            },
            {
                name: '工作日志',
                url: '/worklog'
            },
            {
                name: '每周总结',
                url: '/summary',
            },
            {
                name: '我的任务',
                url: '/task',
            },
        ]
        return (
            <List>
                {ListData.map(ld => (
                    <List.Item
                        key={ld.url}
                        arrow="horizontal"
                        onClick={() => {
                            history.push(`${match.path}${ld.url}`, {name: ld.name})
                        }}
                    >
                        {ld.name}
                    </List.Item>
                ))}
            </List>
        )
    }
}

export default Work
