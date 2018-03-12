import React, {Component} from 'react'
import {
    Tabs
} from 'antd'
import User from './Detail/PermissionUser'
import Role from './Detail/PermissionRole'
import {ajax} from 'UTILS/ajax'

const TabPane = Tabs.TabPane

class Permission extends Component {
    state = {
        __key: this.props.location.state && this.props.location.state.__key ? this.props.location.state.__key : 'user'
    }
    onTabChange = (key) => {
        this.props.history.replace(this.props.location.pathname, {
            page: 1,
            __key: key
        })
        this.setState({
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
                <Tabs defaultActiveKey={this.state.__key} onTabClick={this.onTabChange} animated={false}>
                    <TabPane tab="用户" key="user">
                        <User {...this.props} key={this.state.__key} />
                    </TabPane>
                    <TabPane tab="角色" key="role">
                        <Role {...this.props} key={this.state.__key} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Permission
