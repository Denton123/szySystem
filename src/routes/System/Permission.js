import React, {Component} from 'react'
import {
    Card,
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import User from './Detail/PermissionUser'
import Role from './Detail/PermissionRole'

class Permission extends Component {
    state = {
        key: 'user',
    }
    onTabChange = (type, key) => {
        this.setState({
            [type]: key
        })
        // this.props.history.push(`${this.props.location.pathname}?current=${key}`, {current: key})
    }
    render() {
        const {
            history,
            location,
            match,
            route
        } = this.props

        const tabList = [{
            key: 'user',
            tab: '用户',
        }, {
            key: 'role',
            tab: '角色',
        }]

        const contentList = {
            user: <User {...this.props} />,
            role: <Role {...this.props} />,
        }
        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <Card
                    style={{ width: '100%' }}
                    tabList={tabList}
                    onTabChange={(key) => { this.onTabChange('key', key) }}
                >
                    {contentList[this.state.key]}
                </Card>
            </div>
        )
    }
}

export default Permission
