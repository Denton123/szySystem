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
    // componentWillMount() {
    //     console.log(this.props.location.state)
    //     this.setState({
    //         key: this.props.location.state && this.props.location.state._current ? this.props.location.state._current : 'user'
    //     })
    // }
    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps)
    // }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return nextProps.id !== this.props.id
    // }
    onTabChange = (type, key) => {
        this.setState({
            [type]: key
        })
        this.props.history.replace(this.props.location.pathname, {
            page: 1
        })
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
            user: <User {...this.props} current={this.state.key} />,
            role: <Role {...this.props} current={this.state.key} />,
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
