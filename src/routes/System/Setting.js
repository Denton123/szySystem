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

import Set from './Detail/SettingSet'
import Pwd from './Detail/SettingPwd'

class Setting extends Component {
    state = {
        key: 'set',
    }
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
            key: 'set',
            tab: '基础设置',
        }, {
            key: 'pwd',
            tab: '密码设置',
        }]

        const contentList = {
            set: <Set {...this.props} current={this.state.key} />,
            pwd: <Pwd {...this.props} current={this.state.key} />,
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

export default Setting
