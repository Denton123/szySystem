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
        key: this.props.location.state && this.props.location.state.__key ? this.props.location.state.__key : 'user'
    }
    componentDidMount() {
        console.log(this.props.location)
    }
    onTabChange = (key) => {
        this.props.history.replace(this.props.location.pathname, {
            page: 1,
            __key: key
        })
        console.log(this.props.location)
        this.handleSetState('key', key)
    }

    /**
     * [自定义更新组件的]
     * @Author   szh
     * @DateTime 2017-12-19
     * @param    {String}   stateFields [需要修改的状态名称state]
     * @param    {*}        stateValue  [修改状态的值]
     */
    handleSetState = (stateKey, stateValue) => {
        this.setState({
            [stateKey]: stateValue
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
                <Tabs defaultActiveKey={this.state.key} onTabClick={this.onTabChange} animated={false}>
                    <TabPane tab="用户" key="user">
                        <User {...this.props} getRoleData={this.getRoleData} roleData={this.state.roleData} key={this.state.key} />
                    </TabPane>
                    <TabPane tab="角色" key="role">
                        <Role {...this.props} getRoleData={this.getRoleData} key={this.state.key} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Permission
