import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import { Layout, Breadcrumb, Icon, Button } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import ReactQuill from 'react-quill'

const { Content } = Layout

class checkwork extends Component {
    render() {
        console.log(this.props)
        const child = this.props.child
        const route = this.props.route
        const history = this.props.history
        const location = this.props.location
        const match = this.props.match

        return (
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>{route.name}</Breadcrumb.Item>
                    <Breadcrumb.Item>{child.name}</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    <Button type="primary">考勤</Button>
                </div>
            </Content>
        )
    }
}
export default checkwork
