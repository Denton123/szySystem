import styles from './default.less'
import React from 'react'
import { Layout, Breadcrumb, Icon } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

const { Content } = Layout

class Default extends React.Component {
    render() {
        console.log(this.props)
        const route = this.props.route
        const history = this.props.history
        const location = this.props.location
        const match = this.props.match

        return (
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>{route.name}</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    <div>default</div>
                </div>
            </Content>
        )
    }
}

export default Default
