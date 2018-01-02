import React, {Component} from 'react'
import {
    Tabs
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import User from './Detail/PermissionUser'
import Role from './Detail/PermissionRole'

const TabPane = Tabs.TabPane

class Permission extends Component {
    state = {
        key: this.props.location.state ? this.props.location.state.__key : 'user'
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
    onTabChange = (key) => {
        this.props.history.replace(this.props.location.pathname, {
            page: 1,
            __key: key
        })
    }

    render() {
        const {
            history,
            location,
            match,
            route
        } = this.props

        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <Tabs defaultActiveKey={this.state.key} onTabClick={this.onTabChange}>
                    <TabPane tab="用户" key="user">
                        <User {...this.props} />
                    </TabPane>
                    <TabPane tab="角色" key="role">
                        <Role {...this.props} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Permission
