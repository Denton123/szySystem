import React, {Component} from 'react'
import {
    Tabs
} from 'antd'
import Set from './Detail/SettingSet'
import Pwd from './Detail/SettingPwd'

const TabPane = Tabs.TabPane

class Setting extends Component {
    state = {
        key: this.props.location.state ? this.props.location.state.__key : 'set'
    }
    onTabChange = (key) => {
        this.props.history.replace(this.props.location.pathname, {
            page: 1,
            __key: key
        })
    }
    componentDidMount() {
        console.log(this.props.location)
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
                    <TabPane tab="基础设置" key="set">
                        <Set {...this.props} />
                    </TabPane>
                    <TabPane tab="密码设置" key="pwd">
                        <Pwd {...this.props} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Setting
